import { useState, useEffect, useRef } from "react";

/**
 * Optimized debounce hook with immediate first value
 * Returns the value immediately on first render, then debounces subsequent changes
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const isFirstRender = useRef(true);
    
    useEffect(() => {
        // On first render, set immediately (no delay)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            setDebouncedValue(value);
            return;
        }
        
        // Subsequent changes are debounced
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    
    return debouncedValue;
}

