import { Page, PageDensity, PageOrientation } from './Page';
import { Render } from '../Render/Render';
import { Helper } from '../Helper';
import { FlipDirection } from '../Flip/Flip';
import { Point } from '../BasicTypes';

/**
 * Class representing a book page as a HTML Element
 */
export class HTMLPage extends Page {
    private readonly element: HTMLElement;
    private copiedElement: HTMLElement = null;

    private temporaryCopy: Page = null;

    private isLoad = false;

    constructor(render: Render, element: HTMLElement, density: PageDensity) {
        super(render, density);

        this.element = element;
        this.element.classList.add('stf__item');
        this.element.classList.add('--' + density);
    }

    public newTemporaryCopy(): Page {
        if (this.nowDrawingDensity === PageDensity.HARD) {
            return this;
        }

        if (this.temporaryCopy === null) {
            // 增加镜像效果
            const mask = document.createElement('div');
            mask.className = 'mask'; 
            mask.style.transform = 'scaleX(-1)';
            mask.appendChild(this.element.cloneNode(true) as HTMLElement);
            this.copiedElement = document.createElement('div');
            this.copiedElement.appendChild(mask);
            this.copiedElement.className = 'flipping-copy'; 
            this.element.parentElement.appendChild(this.copiedElement);

            this.temporaryCopy = new HTMLPage(
                this.render,
                this.copiedElement,
                this.nowDrawingDensity,
            );
        }

        return this.getTemporaryCopy();
    }

    public getTemporaryCopy(): Page {
        return this.temporaryCopy;
    }

    public hideTemporaryCopy(): void {
        if (this.temporaryCopy !== null) {
            this.copiedElement.remove();
            this.copiedElement = null;
            this.temporaryCopy = null;
        }
    }

    public draw(tempDensity?: PageDensity): void {
        const density = tempDensity ? tempDensity : this.nowDrawingDensity;

        const pagePos = this.render.convertToGlobal(this.state.position);
        const pageWidth = this.render.getRect().pageWidth;
        const pageHeight = this.render.getRect().height;

        this.element.classList.remove('--simple');

        const commonStyle = `
            display: block;
            z-index: ${this.element.style.zIndex};
            left: 0;
            top: 0;
            width: ${pageWidth}px;
            height: ${pageHeight}px;
        `;

        density === PageDensity.HARD
            ? this.drawHard(commonStyle)
            : this.drawSoft(pagePos, commonStyle);
    }

    private drawHard(commonStyle = ''): void {
        const pos = this.render.getRect().left + this.render.getRect().width / 2;

        const angle = this.state.hardDrawingAngle;

        const newStyle =
            commonStyle +
            `
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                clip-path: none;
                -webkit-clip-path: none;
            ` +
            (this.orientation === PageOrientation.LEFT
                ? `transform-origin: ${this.render.getRect().pageWidth}px 0; 
                    transform: translate3d(0, 0, 0) rotateY(${angle}deg);`
                : `transform-origin: 0 0; 
                    transform: translate3d(${pos}px, 0, 0) rotateY(${angle}deg);`);

        this.element.style.cssText = newStyle;
    }

    private drawSoft(position: Point, commonStyle = ''): void {
        let polygon = 'polygon( ';
        for (const p of this.state.area) {
            if (p !== null) {
                let g =
                    this.render.getDirection() === FlipDirection.BACK
                        ? {
                              x: -p.x + this.state.position.x,
                              y: p.y - this.state.position.y,
                          }
                        : {
                              x: p.x - this.state.position.x,
                              y: p.y - this.state.position.y,
                          };

                g = Helper.GetRotatedPoint(g, { x: 0, y: 0 }, this.state.angle);
                polygon += g.x + 'px ' + g.y + 'px, ';
            }
        }
        polygon = polygon.slice(0, -2);
        polygon += ')';

        // Calculate progress for book-like curve effect
        // Real book pages curve naturally as they flip - the spine area lags behind the edge
        const progress = Math.abs(this.state.angle / Math.PI); // 0 to 1, how far the page has flipped
        const normalizedProgress = Math.min(1, Math.max(0, progress));
        
        // Create a natural curve effect for soft pages (like a real book page)
        // The curve is most pronounced in the middle of the flip
        const curveIntensity = 0.15; // How much the page curves (0 = flat, 1 = maximum curve)
        
        // Calculate natural curve parameters
        // Pages curve more when flipping - creates an arc from spine to edge
        const curveProgress = Math.sin(normalizedProgress * Math.PI); // 0 at start/end, 1 at middle
        const curveFactor = curveProgress * curveIntensity;
        
        // Apply subtle skew for natural page curve
        // Horizontal skew creates the appearance of a curved page
        const skewX = this.render.getDirection() === FlipDirection.FORWARD 
            ? -curveFactor * 3  // Negative for forward flip
            : curveFactor * 3;   // Positive for backward flip
        
        // Subtle scale variation to enhance the curve effect
        // Slight horizontal compression creates depth perception
        const scaleX = 1 - Math.abs(curveFactor) * 0.03;
        
        // Combine transforms for book-like appearance
        const transformOrigin = '0 0';
        let transformValue = '';
        
        if (this.render.isSafari() && this.state.angle === 0) {
            transformValue = `translate(${position.x}px, ${position.y}px)`;
        } else {
            // Apply book-like curve: rotation + horizontal skew + slight scale
            // This creates the natural arc that real book pages have when flipping
            transformValue = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${this.state.angle}rad) skewX(${skewX}deg) scaleX(${scaleX})`;
        }

        const newStyle =
            commonStyle +
            `transform-origin: ${transformOrigin}; clip-path: ${polygon}; -webkit-clip-path: ${polygon}; transform: ${transformValue};`;

        this.element.style.cssText = newStyle;
    }

    public simpleDraw(orient: PageOrientation): void {
        const rect = this.render.getRect();

        const pageWidth = rect.pageWidth;
        const pageHeight = rect.height;

        const x = orient === PageOrientation.RIGHT ? rect.left + rect.pageWidth : rect.left;

        const y = rect.top;

        this.element.classList.add('--simple');
        this.element.style.cssText = `
            position: absolute; 
            display: block; 
            height: ${pageHeight}px; 
            left: ${x}px; 
            top: ${y}px; 
            width: ${pageWidth}px; 
            z-index: ${this.render.getSettings().startZIndex + 1};`;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public load(): void {
        this.isLoad = true;
    }

    public setOrientation(orientation: PageOrientation): void {
        super.setOrientation(orientation);
        this.element.classList.remove('--left', '--right');

        this.element.classList.add(orientation === PageOrientation.RIGHT ? '--right' : '--left');
    }

    public setDrawingDensity(density: PageDensity): void {
        this.element.classList.remove('--soft', '--hard');
        this.element.classList.add('--' + density);

        super.setDrawingDensity(density);
    }
}
