import React, { useCallback, useMemo } from 'react';
import Slider from './slider';
import type { HTMLFlipBookRef } from '../../types';

interface PdfDetails {
    totalPages: number;
    width: number;
    height: number;
}

interface ViewerStates {
    currentPageIndex: number;
    zoomScale: number;
}

interface SliderNavProps {
    flipbookRef: React.RefObject<HTMLFlipBookRef | null>;
    pdfDetails: PdfDetails;
    viewerStates: ViewerStates;
    screenWidth: number;
}

const SliderNav: React.FC<SliderNavProps> = ({ flipbookRef, pdfDetails, viewerStates }) => {
    const totalSlides = useMemo(() => {
        if (!pdfDetails?.totalPages || pdfDetails.totalPages < 1) return 1;
        return pdfDetails.totalPages % 2 === 0 
            ? pdfDetails.totalPages / 2 + 1 
            : (pdfDetails.totalPages - 1) / 2 + 1;
    }, [pdfDetails?.totalPages]);
    
    const currentSlide = useMemo(() => {
        if (!pdfDetails?.totalPages || pdfDetails.totalPages < 1) return 1;
        // Calculate current slide from page index
        // Page 0 = slide 1, Page 2 = slide 2, Page 4 = slide 3, etc.
        const slide = Math.floor((viewerStates.currentPageIndex + 3) / 2);
        return Math.max(1, Math.min(totalSlides, slide));
    }, [viewerStates.currentPageIndex, totalSlides, pdfDetails?.totalPages]);

    // Turn to page number >>>>>>>>
    const onSlideChange = useCallback((slide: number) => {
        // Convert slide number to page index
        // Slide 1 = page 0 (spread 0: pages 0-1)
        // Slide 2 = page 2 (spread 1: pages 2-3)
        // Slide 3 = page 4 (spread 2: pages 4-5)
        // Formula: pageIndex = (slide - 1) * 2
        const calculatedPageIndex = (slide - 1) * 2;
        const validPageIndex = Math.max(0, Math.min(calculatedPageIndex, pdfDetails.totalPages - 1));
        
        if (!flipbookRef.current) {
            return;
        }
        
        // Always call turnToPage - let PageFlip handle if it's the same page
        // This ensures the page is shown even if state says we're already there
        try {
            // Force update by calling turnToPage
            // Even if we're on the same page, this ensures the visual is updated
            flipbookRef.current.turnToPage(validPageIndex);
            
            // Force a render update to ensure visual changes are applied immediately
            // This is especially important when dragging quickly
            if (flipbookRef.current && typeof (flipbookRef.current as any).update === 'function') {
                requestAnimationFrame(() => {
                    (flipbookRef.current as any).update();
                });
            }
            
        } catch (error) {
            console.error('Slider: Error turning to page:', error);
        }
    }, [flipbookRef, pdfDetails.totalPages, viewerStates.currentPageIndex]);

    // Don't render if we don't have valid PDF details
    if (!pdfDetails || !pdfDetails.totalPages || pdfDetails.totalPages < 1) {
        return null;
    }

    return (
        <div style={{ width: '100%', padding: '0.25rem 0' }}>
            <Slider
                totalPages={pdfDetails.totalPages}
                currentSlide={currentSlide}
                onSlideChange={onSlideChange}
                maxSlide={totalSlides}
            />
        </div>
    );
}

export default SliderNav;

