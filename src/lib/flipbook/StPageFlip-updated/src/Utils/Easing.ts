/**
 * Easing function type - takes a value from 0 to 1 and returns an eased value
 */
export type EasingFunction = (t: number) => number;

/**
 * Easing type identifier
 */
export const enum EasingType {
    LINEAR = 'linear',
    EASE_IN = 'ease-in',
    EASE_OUT = 'ease-out',
    EASE_IN_OUT = 'ease-in-out',
    EASE_IN_QUAD = 'ease-in-quad',
    EASE_OUT_QUAD = 'ease-out-quad',
    EASE_IN_OUT_QUAD = 'ease-in-out-quad',
    EASE_IN_CUBIC = 'ease-in-cubic',
    EASE_OUT_CUBIC = 'ease-out-cubic',
    EASE_IN_OUT_CUBIC = 'ease-in-out-cubic',
    EASE_IN_QUART = 'ease-in-quart',
    EASE_OUT_QUART = 'ease-out-quart',
    EASE_IN_OUT_QUART = 'ease-in-out-quart',
}

/**
 * Easing utility class with common easing functions
 * Based on: https://developers.google.com/web/fundamentals/design-and-ux/animations/the-basics-of-easing
 */
export class Easing {
    /**
     * Linear easing - no easing
     */
    public static linear(t: number): number {
        return t;
    }

    /**
     * Ease in - starts slowly and accelerates
     */
    public static easeIn(t: number): number {
        return t * t;
    }

    /**
     * Ease out - starts quickly and decelerates (recommended for UI)
     */
    public static easeOut(t: number): number {
        return t * (2 - t);
    }

    /**
     * Ease in-out - starts slowly, accelerates, then decelerates
     */
    public static easeInOut(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Ease in quad - quadratic ease in
     */
    public static easeInQuad(t: number): number {
        return t * t;
    }

    /**
     * Ease out quad - quadratic ease out
     */
    public static easeOutQuad(t: number): number {
        return t * (2 - t);
    }

    /**
     * Ease in-out quad - quadratic ease in-out
     */
    public static easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Ease in cubic - cubic ease in
     */
    public static easeInCubic(t: number): number {
        return t * t * t;
    }

    /**
     * Ease out cubic - cubic ease out
     */
    public static easeOutCubic(t: number): number {
        return --t * t * t + 1;
    }

    /**
     * Ease in-out cubic - cubic ease in-out
     */
    public static easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    /**
     * Ease in quart - quartic ease in
     */
    public static easeInQuart(t: number): number {
        return t * t * t * t;
    }

    /**
     * Ease out quart - quartic ease out
     */
    public static easeOutQuart(t: number): number {
        return 1 - --t * t * t * t;
    }

    /**
     * Ease in-out quart - quartic ease in-out
     */
    public static easeInOutQuart(t: number): number {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    }

    /**
     * Get easing function by type
     */
    public static getEasingFunction(type: EasingType | string): EasingFunction {
        switch (type) {
            case EasingType.LINEAR:
                return Easing.linear;
            case EasingType.EASE_IN:
                return Easing.easeIn;
            case EasingType.EASE_OUT:
                return Easing.easeOut;
            case EasingType.EASE_IN_OUT:
                return Easing.easeInOut;
            case EasingType.EASE_IN_QUAD:
                return Easing.easeInQuad;
            case EasingType.EASE_OUT_QUAD:
                return Easing.easeOutQuad;
            case EasingType.EASE_IN_OUT_QUAD:
                return Easing.easeInOutQuad;
            case EasingType.EASE_IN_CUBIC:
                return Easing.easeInCubic;
            case EasingType.EASE_OUT_CUBIC:
                return Easing.easeOutCubic;
            case EasingType.EASE_IN_OUT_CUBIC:
                return Easing.easeInOutCubic;
            case EasingType.EASE_IN_QUART:
                return Easing.easeInQuart;
            case EasingType.EASE_OUT_QUART:
                return Easing.easeOutQuart;
            case EasingType.EASE_IN_OUT_QUART:
                return Easing.easeInOutQuart;
            default:
                return Easing.easeOut; // Default to ease-out (recommended for UI)
        }
    }

    /**
     * Apply easing to a normalized value (0 to 1)
     */
    public static applyEasing(t: number, easingFunction: EasingFunction): number {
        // Clamp t between 0 and 1
        t = Math.max(0, Math.min(1, t));
        return easingFunction(t);
    }

    /**
     * Interpolate between two values with easing
     */
    public static interpolate(start: number, end: number, t: number, easingFunction: EasingFunction): number {
        const easedT = Easing.applyEasing(t, easingFunction);
        return start + (end - start) * easedT;
    }

    /**
     * Interpolate between two points with easing
     */
    public static interpolatePoint(start: { x: number; y: number }, end: { x: number; y: number }, t: number, easingFunction: EasingFunction): { x: number; y: number } {
        const easedT = Easing.applyEasing(t, easingFunction);
        return {
            x: start.x + (end.x - start.x) * easedT,
            y: start.y + (end.y - start.y) * easedT,
        };
    }
}

