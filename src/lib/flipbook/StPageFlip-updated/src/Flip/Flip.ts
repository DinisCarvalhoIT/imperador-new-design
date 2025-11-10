import { Orientation, Render } from '../Render/Render';
import { PageFlip } from '../PageFlip';
import { Helper } from '../Helper';
import { PageRect, Point } from '../BasicTypes';
import { FlipCalculation } from './FlipCalculation';
import { Page, PageDensity } from '../Page/Page';
import { UI } from '../UI/UI';
import { Easing, EasingFunction } from '../Utils/Easing';

/**
 * Flipping direction
 */
export const enum FlipDirection {
    FORWARD,
    BACK,
}

/**
 * Active corner when flipping
 */
export const enum FlipCorner {
    TOP = 'top',
    BOTTOM = 'bottom',
}

/**
 * State of the book
 */
export const enum FlippingState {
    /** The user folding the page */
    USER_FOLD = 'user_fold',

    /** Mouse over active corners */
    FOLD_CORNER = 'fold_corner',

    /** During flipping animation */
    FLIPPING = 'flipping',

    /** Base state */
    READ = 'read',
}

/**
 * Class representing the flipping process
 */
export class Flip {
    private readonly render: Render;
    private readonly app: PageFlip;
    private readonly ui = UI;

    private flippingPage: Page = null;
    private bottomPage: Page = null;
    private flippingCoverPage: Page = null; // bottomPage / flippingPage / flippingCoverPage || flippingCoverPage \ flippingPage \ bottomPage

    private calc: FlipCalculation = null;

    private state: FlippingState = FlippingState.READ;

    private smoothedCornerPos: Point = null; // Smoothed corner position for animation

    constructor(render: Render, app: PageFlip) {
        this.render = render;
        this.app = app;
    }

    /**
     * Called when the page folding (User drags page corner)
     *
     * @param globalPos - Touch Point Coordinates (relative window)
     */
    public fold(globalPos: Point): void {
        this.setState(FlippingState.USER_FOLD);

        // If the process has not started yet
        if (this.calc === null) {
            if (!this.start(globalPos)) return; // Exit if start fails
        }

        // Get page position from global position
        const targetPagePos = this.render.convertToPage(globalPos);
        const rect = this.getBoundsRect();
        const settings = this.app.getSettings();
        
        // Determine Y position based on animation mode and settings
        let finalY: number;
        if (settings.animationMode === 'corner') {
            // Corner mode: use Y position from mouse (allows corner movement)
            finalY = Math.max(1, Math.min(rect.height - 1, targetPagePos.y));
        } else {
            // Page mode: lock Y to corner edge if lockYOnDrag is enabled
            if (settings.lockYOnDrag) {
                const isBottomCorner = this.calc.getCorner() === FlipCorner.BOTTOM;
                finalY = isBottomCorner ? rect.height - 1 : 1;
            } else {
                // Allow Y movement for whole page edge
                finalY = Math.max(1, Math.min(rect.height - 1, targetPagePos.y));
            }
        }
        
        // For dragging, allow X to move freely to enable page turning
        // Don't constrain X - allow it to go negative to trigger page turn
        // This allows dragging all the way to the other side
        const finalX = targetPagePos.x;
        
        // Pass position for page movement
        const pagePos: Point = {
            x: finalX,
            y: finalY
        };

        this.do(pagePos);
    }

    /**
     * Page turning with animation
     *
     * @param globalPos - Touch Point Coordinates (relative window)
     */
    public flip(globalPos: Point): void {
        const settings = this.app.getSettings();
        if (settings.disableFlipByClick) {
            // Use appropriate check based on animation mode
            const isOnHoverArea = settings.animationMode === 'corner' 
                ? this.isPointOnCorners(globalPos)
                : this.isPointOnPageEdge(globalPos);
            if (!isOnHoverArea) return;
        }

        // the flipiing process is already running
        if (this.calc !== null) this.render.finishAnimation();

        if (!this.start(globalPos)) return;

        const rect = this.getBoundsRect();

        this.setState(FlippingState.FLIPPING);

        // Determine Y position based on animation mode
        let yStart: number;
        let yDest: number;
        let startX: number;

        if (settings.animationMode === 'corner') {
            // Corner mode: use margin-based positioning (original behavior)
            const topMargins = rect.height / 10;
            yStart = this.calc.getCorner() === FlipCorner.BOTTOM ? rect.height - topMargins : topMargins;
            yDest = this.calc.getCorner() === FlipCorner.BOTTOM ? rect.height : 0;
            startX = rect.pageWidth - topMargins;
        } else {
            // Page mode: lock Y to the edge for whole page movement
            yStart = this.calc.getCorner() === FlipCorner.BOTTOM ? rect.height - 1 : 1;
            yDest = this.calc.getCorner() === FlipCorner.BOTTOM ? rect.height : 0;
            startX = rect.pageWidth - 1; // Start from the edge
        }

        // Сalculations for these points
        this.calc.calc({ x: startX, y: yStart });

        // Run flipping animation
        this.animateFlippingTo(
            { x: startX, y: yStart },
            { x: -rect.pageWidth, y: yDest },
            true,
        );
    }

    /**
     * Start the flipping process. Find direction and corner of flipping. Creating an object for calculation.
     *
     * @param {Point} globalPos - Touch Point Coordinates (relative window)
     *
     * @returns {boolean} True if flipping is possible, false otherwise
     */
    public start(globalPos: Point): boolean {
        this.reset();

        const bookPos = this.render.convertToBook(globalPos);
        const rect = this.getBoundsRect();
        const settings = this.app.getSettings();

        // Find the direction of flipping
        const direction = this.getDirectionByPoint(bookPos);

        // Find the active corner
        // For page mode, use a dead zone in the center to prevent random switching
        let flipCorner: FlipCorner;
        if (settings.animationMode === 'page') {
            const centerDeadZone = rect.height * 0.1; // 10% dead zone in center
            const centerTop = rect.height / 2 - centerDeadZone;
            const centerBottom = rect.height / 2 + centerDeadZone;
            
            if (bookPos.y < centerTop) {
                flipCorner = FlipCorner.TOP;
            } else if (bookPos.y > centerBottom) {
                flipCorner = FlipCorner.BOTTOM;
            } else {
                // In dead zone - default to bottom for consistency
                flipCorner = FlipCorner.BOTTOM;
            }
        } else {
            // Corner mode: use original logic
            flipCorner = bookPos.y >= rect.height / 2 ? FlipCorner.BOTTOM : FlipCorner.TOP;
        }

        if (!this.checkDirection(direction)) return false;

        try {
            this.flippingPage = this.app.getPageCollection().getFlippingPage(direction);
            this.bottomPage = this.app.getPageCollection().getBottomPage(direction);

            this.flippingCoverPage = this.app.getPageCollection().getFlippingCoverPage(direction);

            // In landscape mode, needed to set the density  of the next page to the same as that of the flipped
            if (this.render.getOrientation() === Orientation.LANDSCAPE) {
                if (direction === FlipDirection.BACK) {
                    const nextPage = this.app.getPageCollection().nextBy(this.flippingPage);

                    if (nextPage !== null) {
                        if (this.flippingPage.getDensity() !== nextPage.getDensity()) {
                            this.flippingPage.setDrawingDensity(PageDensity.HARD);
                            nextPage.setDrawingDensity(PageDensity.HARD);
                        }
                    }
                } else {
                    const prevPage = this.app.getPageCollection().prevBy(this.flippingPage);

                    if (prevPage !== null) {
                        if (this.flippingPage.getDensity() !== prevPage.getDensity()) {
                            this.flippingPage.setDrawingDensity(PageDensity.HARD);
                            prevPage.setDrawingDensity(PageDensity.HARD);
                        }
                    }
                }
            }

            this.render.setDirection(direction);
            this.calc = new FlipCalculation(
                direction,
                flipCorner,
                rect.pageWidth.toString(10), // fix bug with type casting
                rect.height.toString(10), // fix bug with type casting
            );

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Perform calculations for the current page position. Pass data to render object
     *
     * @param {Point} pagePos - Touch Point Coordinates (relative active page)
     */
    private do(pagePos: Point): void {
        if (this.calc === null) return; // Flipping process not started

        if (this.calc.calc(pagePos)) {
            // Perform calculations for a specific position
            const progress = this.calc.getFlippingProgress();

            this.bottomPage.setArea(this.calc.getBottomClipArea());
            this.bottomPage.setPosition(this.calc.getBottomPagePosition());
            this.bottomPage.setAngle(0);
            this.bottomPage.setHardAngle(0);

            this.flippingPage.setArea(this.calc.getFlippingClipArea());
            this.flippingPage.setPosition(this.calc.getActiveCorner());
            this.flippingPage.setAngle(this.calc.getAngle());

            if (this.calc.getDirection() === FlipDirection.FORWARD) {
                this.flippingPage.setHardAngle((90 * (200 - progress * 2)) / 100);
            } else {
                this.flippingPage.setHardAngle((-90 * (200 - progress * 2)) / 100);
            }

            this.flippingCoverPage?.setArea(this.calc.getFlippingCoverClipArea());
            this.flippingCoverPage?.setPosition(this.calc.getBottomPagePosition());
            this.flippingCoverPage?.setAngle(0);
            this.flippingCoverPage?.setHardAngle(0);

            this.render.setPageRect(this.calc.getRect());

            this.render.setBottomPage(this.bottomPage);
            this.render.setFlippingPage(this.flippingPage);

            this.render.setShadowData(
                this.calc.getShadowStartPoint(),
                this.calc.getShadowAngle(),
                progress,
                this.calc.getDirection(),
            );
        }
    }

    /**
     * Turn to the specified page number (with animation)
     *
     * @param {number} page - New page number
     * @param {FlipCorner} corner - Active page corner when turning
     */
    public flipToPage(page: number, corner: FlipCorner): void {
        const current = this.app.getPageCollection().getCurrentSpreadIndex();
        const next = this.app.getPageCollection().getSpreadIndexByPage(page);

        try {
            if (next > current) {
                this.app.getPageCollection().setCurrentSpreadIndex(next - 1);
                this.flipNext(corner);
            }
            if (next < current) {
                this.app.getPageCollection().setCurrentSpreadIndex(next + 1);
                this.flipPrev(corner);
            }
        } catch (e) {
            //
        }
    }

    /**
     * Turn to the next page (with animation)
     *
     * @param {FlipCorner} corner - Active page corner when turning
     */
    public flipNext(corner: FlipCorner): void {
        this.flip({
            x: this.render.getRect().left + this.render.getRect().pageWidth * 2 - 10,
            y: corner === FlipCorner.TOP ? 1 : this.render.getRect().height - 2,
        });
    }

    /**
     * Turn to the prev page (with animation)
     *
     * @param {FlipCorner} corner - Active page corner when turning
     */
    public flipPrev(corner: FlipCorner): void {
        this.flip({
            x: this.render.getRect().left + 10,
            y: corner === FlipCorner.TOP ? 1 : this.render.getRect().height - 2,
        });
    }

    /**
     * Called when the user has stopped flipping
     */
    public stopMove(): void {
        if (this.calc === null) return;

        const pos = this.calc.getPosition();
        const rect = this.getBoundsRect();

        const y = this.calc.getCorner() === FlipCorner.BOTTOM ? rect.height : 0;

        if (pos.x <= 0) this.animateFlippingTo(pos, { x: -rect.pageWidth, y }, true);
        else this.animateFlippingTo(pos, { x: rect.pageWidth, y }, false);
    }

    /**
     * Fold the corners of the book when the mouse pointer is over them.
     * Called when the mouse pointer is over the book without clicking
     *
     * @param globalPos
     */
    public showCorner(globalPos: Point): void {
        if (!this.checkState(FlippingState.READ, FlippingState.FOLD_CORNER)) return;

        const rect = this.getBoundsRect();
        const pageWidth = rect.pageWidth;
        const settings = this.app.getSettings();

        // Use appropriate check based on animation mode
        const isOnHoverArea = settings.animationMode === 'corner' 
            ? this.isPointOnCorners(globalPos)
            : this.isPointOnPageEdge(globalPos);

        if (isOnHoverArea) {
            if (this.calc === null) {
                if (!this.start(globalPos)) return;

                this.setState(FlippingState.FOLD_CORNER);

                // Use the corner that was determined in start() to ensure consistency
                // This prevents random switching when hovering near the center
                const isBottomCorner = this.calc.getCorner() === FlipCorner.BOTTOM;
                
                // Determine Y position based on animation mode
                let lockedY: number;
                if (settings.animationMode === 'corner') {
                    // Corner mode: use Y from mouse position (allows corner movement)
                    const pagePos = this.render.convertToPage(globalPos);
                    lockedY = Math.max(1, Math.min(rect.height - 1, pagePos.y));
                } else {
                    // Page mode: lock Y to corner edge
                    lockedY = isBottomCorner ? rect.height - 1 : 1;
                }
                
                // Calculate initial fold position based on animation mode
                let foldDistance: number;
                if (settings.animationMode === 'corner') {
                    // Corner mode: small fold (50px like original)
                    foldDistance = 50;
                } else {
                    // Page mode: use configured fold distance
                    foldDistance = pageWidth * 0.15; // 15% of page width for whole edge movement
                }
                
                const initialX = pageWidth - 1;
                const targetX = pageWidth - foldDistance;

                this.calc.calc({ x: initialX, y: lockedY });

                // Initialize smoothed position
                const pagePos = this.render.convertToPage(globalPos);
                this.smoothedCornerPos = { 
                    x: pagePos.x, 
                    y: lockedY
                };

                // Animate to initial fold position
                this.animateFlippingTo(
                    { x: initialX, y: lockedY },
                    { x: targetX, y: lockedY },
                    false,
                    false,
                );
            } else {
                // Smooth position to mouse
                const targetPagePos = this.render.convertToPage(globalPos);
                const smoothing = settings.cornerSmoothing || 0.15;
                
                // Determine Y position based on animation mode
                // Use existing corner from calc to prevent switching when hovering near center
                let lockedY: number;
                if (settings.animationMode === 'corner') {
                    // Corner mode: use Y from mouse position (allows corner movement)
                    lockedY = Math.max(1, Math.min(rect.height - 1, targetPagePos.y));
                } else {
                    // Page mode: lock Y to corner edge using the existing corner from calc
                    // This prevents random switching between top/bottom when hovering center
                    const isBottomCorner = this.calc.getCorner() === FlipCorner.BOTTOM;
                    lockedY = isBottomCorner ? rect.height - 1 : 1;
                }

                // Initialize smoothed position if not set
                if (this.smoothedCornerPos === null) {
                    this.smoothedCornerPos = { 
                        x: targetPagePos.x, 
                        y: lockedY 
                    };
                }

                // Linear interpolation (lerp) for smooth movement
                if (settings.animationMode === 'corner') {
                    // Corner mode: smooth both X and Y
                    this.smoothedCornerPos = {
                        x: this.smoothedCornerPos.x + (targetPagePos.x - this.smoothedCornerPos.x) * (1 - smoothing),
                        y: this.smoothedCornerPos.y + (targetPagePos.y - this.smoothedCornerPos.y) * (1 - smoothing),
                    };
                } else {
                    // Page mode: only smooth X, lock Y
                    this.smoothedCornerPos = {
                        x: this.smoothedCornerPos.x + (targetPagePos.x - this.smoothedCornerPos.x) * (1 - smoothing),
                        y: lockedY, // Always lock Y to corner position
                    };
                }

                // Constrain X to fold range based on animation mode
                if (settings.animationMode === 'corner') {
                    // Corner mode: small fold area
                    const maxFoldDistance = 50;
                    const minX = pageWidth - maxFoldDistance;
                    const maxX = pageWidth - 1;
                    this.smoothedCornerPos.x = Math.max(minX, Math.min(maxX, this.smoothedCornerPos.x));
                } else {
                    // Page mode: use configured max fold distance
                    const maxFoldDistance = pageWidth * (settings.maxHoverFoldDistance || 0.25);
                    const minX = pageWidth - maxFoldDistance;
                    const maxX = pageWidth - 1;
                    this.smoothedCornerPos.x = Math.max(minX, Math.min(maxX, this.smoothedCornerPos.x));
                }

                this.render.startAnimationRenderLoop(() => {
                    this.do(this.smoothedCornerPos);
                });
            }
        } else {
            this.setState(FlippingState.READ);
            this.render.finishAnimation();
            this.render.stopAnimationRenderLoop();
            
            // Reset smoothed position
            this.smoothedCornerPos = null;

            this.stopMove();
        }
    }

    /**
     * Starting the flipping animation process
     *
     * @param {Point} start - animation start point
     * @param {Point} dest - animation end point
     * @param {boolean} isTurned - will the page turn over, or just bring it back
     * @param {boolean} needReset - reset the flipping process at the end of the animation
     */
    private animateFlippingTo(
        start: Point,
        dest: Point,
        isTurned: boolean,
        needReset = true,
    ): void {
        const points = Helper.GetCordsFromTwoPoint(start, dest);

        // Get easing function from settings
        const easingType = this.app.getSettings().easing || 'ease-out';
        const easingFunction = Easing.getEasingFunction(easingType);

        // Apply easing to the animation frames
        const easedFrames: (() => void)[] = [];
        const totalFrames = points.length;

        if (totalFrames === 0) {
            // No frames to animate
            return;
        }

        if (totalFrames === 1) {
            // Single frame, no easing needed
            easedFrames.push(() => this.do(points[0]));
        } else {
            for (let i = 0; i < totalFrames; i++) {
                // Normalize frame index (0 to 1)
                const t = i / (totalFrames - 1);
                
                // Apply easing to get eased progress
                const easedT = easingFunction(t);
                
                // Calculate eased frame index
                const easedIndex = Math.round(easedT * (totalFrames - 1));
                
                // Clamp to valid range
                const frameIndex = Math.min(Math.max(0, easedIndex), totalFrames - 1);
                
                // Store the frame action
                easedFrames.push(() => this.do(points[frameIndex]));
            }
        }

        const duration = this.getAnimationDuration(totalFrames);

        this.render.startAnimation(easedFrames, duration, () => {
            // callback function
            if (!this.calc) return;

            if (isTurned) {
                if (this.calc.getDirection() === FlipDirection.BACK) {
                    if (this.app.getOrientation() === Orientation.LANDSCAPE) {
                        if (this.app.getCurrentPageIndex() === 1) this.app.ui.firstPageCenter();
                        else if (this.app.getCurrentPageIndex() === this.app.getPageCount() - 1) this.app.ui.firstPageCenterReverse();
                    }

                    this.app.turnToPrevPage();
                } else {
                    if (this.app.getOrientation() === Orientation.LANDSCAPE) {
                        if (this.app.getCurrentPageIndex() === 0) {
                            this.app.ui.firstPageCenterReverse();
                        } else if (this.app.getCurrentPageIndex() === this.app.getPageCount() - 3) {
                            this.app.ui.firstPageEndCenter();
                        }
                    }
                    this.app.turnToNextPage();
                }
            }

            if (needReset) {
                this.render.setBottomPage(null);
                this.render.setFlippingPage(null);
                this.render.clearShadow();

                this.setState(FlippingState.READ);
                this.reset();
            }
        });
    }

    /**
     * Get the current calculations object
     */
    public getCalculation(): FlipCalculation {
        return this.calc;
    }

    /**
     * Get current flipping state
     */
    public getState(): FlippingState {
        return this.state;
    }

    private setState(newState: FlippingState): void {
        if (this.state !== newState) {
            this.app.updateState(newState);
            this.state = newState;
        }
    }

    private getDirectionByPoint(touchPos: Point): FlipDirection {
        const rect = this.getBoundsRect();

        if (this.render.getOrientation() === Orientation.PORTRAIT) {
            if (touchPos.x - rect.pageWidth <= rect.width / 5) {
                return FlipDirection.BACK;
            }
        } else if (touchPos.x < rect.width / 2) {
            return FlipDirection.BACK;
        }

        return FlipDirection.FORWARD;
    }

    private getAnimationDuration(size: number): number {
        const defaultTime = this.app.getSettings().flippingTime;

        const rect = this.getBoundsRect();
        const ratio = rect.pageWidth / 300;
        const timePerPoint = defaultTime / 600;

        return (size / ratio) * timePerPoint;
    }

    private checkDirection(direction: FlipDirection): boolean {
        if (direction === FlipDirection.FORWARD)
            return this.app.getCurrentPageIndex() < this.app.getPageCount() - 1;

        return this.app.getCurrentPageIndex() >= 1;
    }

    private reset(): void {
        this.calc = null;
        this.flippingPage = null;
        this.bottomPage = null;
        this.smoothedCornerPos = null;
    }

    private getBoundsRect(): PageRect {
        return this.render.getRect();
    }

    private checkState(...states: FlippingState[]): boolean {
        for (const state of states) {
            if (this.state === state) return true;
        }

        return false;
    }

    private isPointOnCorners(globalPos: Point): boolean {
        const rect = this.getBoundsRect();
        const pageWidth = rect.pageWidth;

        const operatingDistance = Math.sqrt(Math.pow(pageWidth, 2) + Math.pow(rect.height, 2)) / 5;

        const bookPos = this.render.convertToBook(globalPos);

        return (
            bookPos.x > 0 &&
            bookPos.y > 0 &&
            bookPos.x < rect.width &&
            bookPos.y < rect.height &&
            (bookPos.x < operatingDistance || bookPos.x > rect.width - operatingDistance) &&
            (bookPos.y < operatingDistance || bookPos.y > rect.height - operatingDistance)
        );
    }

    /**
     * Check if the point is on the whole edge of the page (for page fold mode)
     * This checks the entire left or right edge, not just corners
     *
     * @param globalPos - Touch Point Coordinates (relative window)
     * @returns {boolean} True if point is on page edge
     */
    private isPointOnPageEdge(globalPos: Point): boolean {
        const rect = this.getBoundsRect();
        const pageWidth = rect.pageWidth;

        const operatingDistance = Math.sqrt(Math.pow(pageWidth, 2) + Math.pow(rect.height, 2)) / 4;

        const bookPos = this.render.convertToBook(globalPos);

        // Check if point is within bounds and on the left or right edge
        // For page mode, we check the entire edge (Y can be anywhere)
        return (
            bookPos.x > 0 &&
            bookPos.y > 0 &&
            bookPos.x < rect.width &&
            bookPos.y < rect.height &&
            (bookPos.x < operatingDistance || bookPos.x > rect.width - operatingDistance)
        );
    }
}
