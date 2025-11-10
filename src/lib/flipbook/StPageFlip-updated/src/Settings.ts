/**
 * Book size calculation type
 */
export const enum SizeType {
    /** Dimensions are fixed */
    FIXED = 'fixed',
    /** Dimensions are calculated based on the parent element */
    STRETCH = 'stretch',
}

/**
 * Configuration object
 */
export interface FlipSetting {
    /** Page number from which to start viewing */
    startPage: number;
    /** Whether the book will be stretched under the parent element or not */
    size: SizeType;

    width: number;
    height: number;

    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;

    /** Draw shadows or not when page flipping */
    drawShadow: boolean;
    /** Flipping animation time */
    flippingTime: number;

    /** Enable switching to portrait mode */
    usePortrait: boolean;
    /** Initial value to z-index */
    startZIndex: number;
    /** If this value is true, the parent element will be equal to the size of the book */
    autoSize: boolean;
    /** Shadow intensity (1: max intensity, 0: hidden shadows) */
    maxShadowOpacity: number;

    /** If this value is true, the first and the last pages will be marked as hard and will be shown in single page mode */
    showCover: boolean;
    /** If this value is true, the first and last pages will ignore the hard pages */
    disableHardPages: boolean;
    firstCoverStartLeft: boolean;
    /** Disable content scrolling when touching a book on mobile devices */
    mobileScrollSupport: boolean;

    /** Set the forward event of clicking on child elements (buttons, links) */
    clickEventForward: boolean;

    /** Using mouse and touch events to page flipping */
    useMouseEvents: boolean;

    swipeDistance: number;

    /** if this value is true, fold the corners of the book when the mouse pointer is over them. */
    showPageCorners: boolean;

    /** if this value is true, flipping by clicking on the whole book will be locked. Only on corners */
    disableFlipByClick: boolean;

    /** Easing function type for page flip animations */
    easing: string;

    /** Smoothing factor for corner position (0-1, higher = smoother but slower). 0 = instant, 1 = maximum smoothness */
    cornerSmoothing: number;

    /** Animation mode: 'corner' for corner-only animation, 'page' for whole page edge animation */
    animationMode: 'corner' | 'page';

    /** Maximum hover fold distance as percentage of page width (0-1). Only applies to hover, not drag */
    maxHoverFoldDistance: number;

    /** Whether to lock Y position during drag to prevent vertical movement */
    lockYOnDrag: boolean;
}

export class Settings {
    private _default: FlipSetting = {
        startPage: 0,
        size: SizeType.FIXED,
        width: 0,
        height: 0,
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
        drawShadow: true,
        flippingTime: 1000,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        maxShadowOpacity: 1,
        showCover: false,
        disableHardPages: false,
        firstCoverStartLeft: true,
        mobileScrollSupport: true,
        swipeDistance: 30,
        clickEventForward: true,
        useMouseEvents: true,
        showPageCorners: true,
        disableFlipByClick: false,
        easing: 'ease-out',
        cornerSmoothing: 0.15,
        animationMode: 'page', // Default to whole page edge animation
        maxHoverFoldDistance: 0.25, // 25% of page width for hover
        lockYOnDrag: true, // Lock Y to prevent vertical movement during drag
    };

    /**
     * Processing parameters received from the user. Substitution default values
     *
     * @param userSetting
     * @returns {FlipSetting} Сonfiguration object
     */
    public getSettings(userSetting: Record<string, number | string | boolean>): FlipSetting {
        const result = this._default;
        Object.assign(result, userSetting);

        if (result.size !== SizeType.STRETCH && result.size !== SizeType.FIXED)
            throw new Error('Invalid size type. Available only "fixed" and "stretch" value');

        if (result.width <= 0 || result.height <= 0) throw new Error('Invalid width or height');

        if (result.flippingTime <= 0) throw new Error('Invalid flipping time');

        // Validate corner smoothing (0-1 range)
        if (result.cornerSmoothing !== undefined) {
            if (result.cornerSmoothing < 0 || result.cornerSmoothing > 1) {
                throw new Error('cornerSmoothing must be between 0 and 1');
            }
        }

        // Validate animation mode
        if (result.animationMode !== undefined) {
            if (result.animationMode !== 'corner' && result.animationMode !== 'page') {
                throw new Error('animationMode must be either "corner" or "page"');
            }
        }

        // Validate maxHoverFoldDistance (0-1 range)
        if (result.maxHoverFoldDistance !== undefined) {
            if (result.maxHoverFoldDistance < 0 || result.maxHoverFoldDistance > 1) {
                throw new Error('maxHoverFoldDistance must be between 0 and 1');
            }
        }

        if (result.size === SizeType.STRETCH) {
            if (result.minWidth <= 0) result.minWidth = 100;

            if (result.maxWidth < result.minWidth) result.maxWidth = 2000;

            if (result.minHeight <= 0) result.minHeight = 100;

            if (result.maxHeight < result.minHeight) result.maxHeight = 2000;
        } else {
            result.minWidth = result.width;
            result.maxWidth = result.width;
            result.minHeight = result.height;
            result.maxHeight = result.height;
        }

        return result;
    }
}
