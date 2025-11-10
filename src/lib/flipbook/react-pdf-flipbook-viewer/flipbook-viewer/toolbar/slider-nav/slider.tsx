import { cn } from '../../../lib/utils';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import HoverItem from './hover-item';

interface SliderProps {
    maxSlide?: number;
    currentSlide: number;
    onSlideChange: (slide: number) => void;
    totalPages: number;
}

const Slider: React.FC<SliderProps> = ({ maxSlide = 10, currentSlide, onSlideChange, totalPages }) => {
    const [value, setValue] = useState<number>(currentSlide);
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [thumbPosition, setThumbPosition] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
    const sliderRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number>(0);
    const dragStartPosition = useRef<number>(0);
    const lastSlideChangeRef = useRef<number>(currentSlide);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentDragValueRef = useRef<number>(currentSlide); // Track current value during drag
    
    // Initialize lastSlideChangeRef when currentSlide changes (but not during drag)
    useEffect(() => {
        if (!dragging) {
            lastSlideChangeRef.current = currentSlide;
        }
    }, [currentSlide, dragging]);

    // Update thumb position on value & screen size change >>>>>>>>>
    useEffect(() => {
        const updateThumbPosition = () => {
            if (sliderRef.current && !dragging && maxSlide > 1) {
                const sliderRect = sliderRef.current.getBoundingClientRect();
                const sliderWidth = sliderRect.width;
                // Calculate position: value 1 = left, value maxSlide = right
                const percentage = (value - 1) / (maxSlide - 1);
                const newPosition = percentage * sliderWidth;
                setThumbPosition(newPosition);
            } else if (sliderRef.current && maxSlide === 1) {
                setThumbPosition(0);
            }
        };
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(updateThumbPosition);
        window.addEventListener('resize', updateThumbPosition);
        return () => window.removeEventListener('resize', updateThumbPosition);
    }, [value, maxSlide, dragging]);

    // Calculate value from position
    const getValueFromPosition = useCallback((clientX: number): number => {
        if (!sliderRef.current) return value;
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const offsetX = clientX - sliderRect.left;
        // Calculate value based on position (0 to sliderWidth maps to 1 to maxSlide)
        const percentage = Math.max(0, Math.min(1, offsetX / sliderWidth));
        const newValue = Math.min(
            Math.max(1, Math.round(percentage * (maxSlide - 1) + 1)),
            maxSlide
        );
        return newValue;
    }, [maxSlide, value]);

    // Handle dragging the thumb with native pointer events >>>>>>>>>
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!sliderRef.current || !thumbRef.current) return;
        
        setDragging(true);
        dragStartX.current = e.clientX;
        dragStartPosition.current = thumbPosition;
        
        thumbRef.current.setPointerCapture(e.pointerId);
    }, [thumbPosition]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
        if (!sliderRef.current) return;

        if (dragging && thumbRef.current) {
            // Handle dragging
            const sliderRect = sliderRef.current.getBoundingClientRect();
            const sliderWidth = sliderRect.width;
            const thumbWidth = thumbRef.current.clientWidth;
            const deltaX = e.clientX - dragStartX.current;
            const newPosition = Math.max(thumbWidth / 2, Math.min(sliderWidth - thumbWidth / 2, dragStartPosition.current + deltaX));
            setThumbPosition(newPosition);

            const newValue = getValueFromPosition(e.clientX);
            if (newValue >= 1 && newValue <= maxSlide) {
                // Update the current drag value ref
                currentDragValueRef.current = newValue;
                
                // Update value immediately for visual feedback
                setValue(prevValue => {
                    if (prevValue !== newValue) {
                        return newValue;
                    }
                    return prevValue;
                });
                setHoverValue(newValue);
                
                // Throttle onSlideChange calls during drag to prevent too many rapid updates
                // Only call if the value actually changed from the last call
                if (newValue !== lastSlideChangeRef.current) {
                    // Clear any pending throttle
                    if (throttleTimeoutRef.current) {
                        clearTimeout(throttleTimeoutRef.current);
                        throttleTimeoutRef.current = null;
                    }
                    
                    // Update the last change ref immediately to prevent duplicate calls
                    const valueToChange = newValue;
                    lastSlideChangeRef.current = valueToChange;
                    
                    // Throttle the actual call to prevent too many rapid updates
                    // Use a shorter throttle (50ms) for more responsive updates
                    throttleTimeoutRef.current = setTimeout(() => {
                        // Double-check the value hasn't changed again
                        if (valueToChange === lastSlideChangeRef.current) {
                            onSlideChange(valueToChange);
                        }
                        throttleTimeoutRef.current = null;
                    }, 50); // 50ms throttle for responsive but not overwhelming updates
                }
            }

            if (tooltipRef.current) {
                const tooltipWidth = tooltipRef.current.getBoundingClientRect().width;
                const tooltipHeight = tooltipRef.current.getBoundingClientRect().height;
                const tooltipLeft = Math.max(0, Math.min(newPosition - tooltipWidth / 2, sliderWidth - tooltipWidth));
                const tooltipTop = Math.max(0, Math.min(-20 - tooltipHeight / 2, sliderRect.height - tooltipHeight));
                setTooltipPosition({ left: tooltipLeft, top: tooltipTop });
            }
        } else if (!dragging && tooltipRef.current) {
            // Handle hover tooltip when not dragging
            const rect = sliderRef.current.getBoundingClientRect();
            const hoverValue = Math.min(
                Math.max(1, Math.round(((e.clientX - rect.left) / rect.width) * (maxSlide - 1) + 1)),
                maxSlide
            );
            setHoverValue(hoverValue);
            const tooltipWidth = tooltipRef.current.getBoundingClientRect().width;
            const tooltipHeight = tooltipRef.current.getBoundingClientRect().height;
            const tooltipLeft = Math.max(0, Math.min(e.clientX - rect.left - tooltipWidth / 2, rect.width - tooltipWidth));
            const tooltipTop = Math.max(0, Math.min(e.clientY - rect.top - 20 - tooltipHeight / 2, rect.height - tooltipHeight));
            setTooltipPosition({ left: tooltipLeft, top: tooltipTop });
        }
    }, [dragging, maxSlide, getValueFromPosition, onSlideChange, currentSlide]);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
        if (!dragging) return;
        
        // Clear any pending throttle
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
            throttleTimeoutRef.current = null;
        }
        
        // Get the final value from the ref (most up-to-date during drag)
        const finalValue = currentDragValueRef.current;
        
        // Always apply the final value on release to ensure the page is set correctly
        // This is critical - even if we've already called onSlideChange during drag,
        // we need to ensure the final position is applied
        
        // Always call onSlideChange on release to ensure final position is set
        // This handles cases where the throttle might have been cancelled or the value changed
        if (finalValue >= 1 && finalValue <= maxSlide) {
            lastSlideChangeRef.current = finalValue;
            onSlideChange(finalValue);
        }
        
        setDragging(false);
        if (thumbRef.current) {
            thumbRef.current.releasePointerCapture(e.pointerId);
        }
    }, [dragging, value, onSlideChange, maxSlide]);

    // Handle onClick to change slide >>>>>>>>>
    const handleSlideChange = useCallback((e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (sliderRef.current && !dragging) {
            const newValue = getValueFromPosition(e.clientX);
            if (newValue >= 1 && newValue <= maxSlide) {
                setValue(newValue);
                lastSlideChangeRef.current = newValue;
                currentDragValueRef.current = newValue;
                // Call onSlideChange immediately when clicking
                onSlideChange(newValue);
            }
        }
    }, [sliderRef, dragging, getValueFromPosition, maxSlide, value, onSlideChange]);
    
    // Calculate checkpoint positions for visual markers (as percentages)
    const checkpointPositions = React.useMemo(() => {
        if (maxSlide <= 1) return [];
        return Array.from({ length: maxSlide }, (_, index) => {
            const slide = index + 1;
            const percentage = maxSlide === 1 ? 0 : (slide - 1) / (maxSlide - 1);
            return {
                slide,
                percentage,
            };
        });
    }, [maxSlide]);

    // Handle hover value tooltip >>>>>>>>>
    const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging) {
            handlePointerMove(e);
        }
    };

    // Hide hover value tooltip >>>>>>>>>
    const handlePointerLeave = () => {
        if (!dragging) {
            setHoverValue(null);
        }
    };

    // Global pointer move handler for dragging
    useEffect(() => {
        if (dragging) {
            const handleGlobalMove = (e: PointerEvent) => {
                handlePointerMove(e);
            };
            const handleGlobalUp = (e: PointerEvent) => {
                handlePointerUp(e);
            };
            window.addEventListener('pointermove', handleGlobalMove);
            window.addEventListener('pointerup', handleGlobalUp);
            return () => {
                window.removeEventListener('pointermove', handleGlobalMove);
                window.removeEventListener('pointerup', handleGlobalUp);
                // Cleanup throttle on unmount or when dragging stops
                if (throttleTimeoutRef.current) {
                    clearTimeout(throttleTimeoutRef.current);
                    throttleTimeoutRef.current = null;
                }
            };
        }
    }, [dragging, handlePointerMove, handlePointerUp]);

    // Update value on slide change - but don't update if we're dragging (to prevent reset)
    useEffect(() => {
        if (!dragging) {
            // Always sync with currentSlide when not dragging
            if (currentSlide !== value) {
                setValue(currentSlide);
                lastSlideChangeRef.current = currentSlide;
            }
        }
    }, [currentSlide, dragging, value]); // Added 'value' back but with proper check

    // Note: We don't need to call onSlideChange here because we call it directly
    // in handleSlideChange, checkpoint clicks, and handlePointerUp
    
    // Don't render if maxSlide is 0 or invalid
    if (!maxSlide || maxSlide < 1) {
        return null;
    }

    return (
        <div style={{ padding: '0.25rem 0' }}>
            <div
                ref={sliderRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                }}
                className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                onPointerMove={handleSliderPointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerLeave}
            >
                <div
                    ref={thumbRef}
                    style={{
                        position: 'absolute',
                        zIndex: 20,
                        width: dragging ? '20px' : '16px',
                        height: dragging ? '20px' : '16px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        touchAction: 'none',
                        userSelect: 'none',
                        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
                        left: `${thumbPosition}px`,
                        transform: 'translateX(-50%)',
                        top: '50%',
                        marginTop: dragging ? '-10px' : '-8px',
                        transition: dragging ? 'none' : 'all 0.2s',
                    }}
                    className="absolute z-20 bg-primary rounded-full cursor-pointer touch-none select-none shadow-md"
                    onPointerDown={handlePointerDown}
                />
                {/* Visual checkpoints/markers for each slide */}
                {checkpointPositions.map(({ slide, percentage }) => (
                    <div
                        key={slide}
                        className="absolute cursor-pointer"
                        style={{
                            left: `${percentage * 100}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: slide === value ? '#3b82f6' : '#9ca3af',
                            zIndex: 15,
                            pointerEvents: dragging ? 'none' : 'auto',
                            transition: 'background-color 0.2s',
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!dragging) {
                                setValue(slide);
                                lastSlideChangeRef.current = slide;
                                currentDragValueRef.current = slide;
                                onSlideChange(slide);
                            }
                        }}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!dragging) {
                                setValue(slide);
                                lastSlideChangeRef.current = slide;
                                currentDragValueRef.current = slide;
                                onSlideChange(slide);
                            }
                        }}
                    />
                ))}
                {/* // Click to change slide - positioned behind thumb but clickable >>>>>>>>> */}
                <div
                    className="absolute inset-0 cursor-pointer bg-transparent"
                    style={{ 
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '24px',
                        cursor: 'pointer',
                        zIndex: 10,
                        pointerEvents: dragging ? 'none' : 'auto'
                    }}
                    onClick={handleSlideChange}
                    onPointerDown={handleSlideChange}
                />
                {/* // Tooltip for hover value >>>>>>>>> */}
                <div
                    ref={tooltipRef}
                    className={cn('bg-primary/20 backdrop-blur-sm text-white rounded p-2 text-xs w-fit h-fit pointer-events-none', hoverValue === null && 'opacity-0 w-0 h-0 select-none')}
                    style={{ position: 'absolute', left: tooltipPosition.left, bottom: '20px' }}
                >
                    <HoverItem
                        slide={hoverValue}
                        totalPages={totalPages}
                        totalSlides={maxSlide}
                    />
                </div>
            </div>
        </div>
    );
};

export default Slider;

