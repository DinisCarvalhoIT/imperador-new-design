import React, { useEffect, useCallback } from 'react';
import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import keyboardjs from 'keyboardjs';
import Zoom from './zoom';
import SliderNav from './slider-nav/slider-nav';
import useScreenSize from '../../hooks/use-screensize';
interface PdfDetails {
    totalPages: number;
    width: number;
    height: number;
}

interface ViewerStates {
    currentPageIndex: number;
    zoomScale: number;
}

import type { HTMLFlipBookRef } from '../types';

interface ToolbarProps {
    flipbookRef: React.RefObject<HTMLFlipBookRef | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    screenfull: typeof import('screenfull').default;
    pdfDetails: PdfDetails;
    viewerStates: ViewerStates;
    setViewerStates: React.Dispatch<React.SetStateAction<ViewerStates>>;
}

const Toolbar: React.FC<ToolbarProps> = ({ flipbookRef, containerRef, screenfull, pdfDetails, viewerStates }) => {
    const { width: screenWidth } = useScreenSize();
    const pagesInFlipView = ((viewerStates.currentPageIndex + 1) % 2 === 0 && (viewerStates.currentPageIndex + 1) !== pdfDetails.totalPages)
        ? `${(viewerStates.currentPageIndex + 1)} - ${viewerStates.currentPageIndex + 2}`
        : (viewerStates.currentPageIndex + 1)

    // Full screen >>>>>>>>>
    const fullScreen = useCallback(() => {
        if (screenfull && screenfull.isEnabled && containerRef.current) {
            screenfull.toggle(containerRef.current);
        }
        if (screenfull && screenfull.on) {
            screenfull.on('error', (event: Event) => {
                alert('Failed to enable fullscreen');
                console.error(event);
            });
        }
    }, [containerRef]);

    // Keyboard shortcuts >>>>>>>>>
    useEffect(() => {
        const handleRight = () => flipbookRef.current?.flipNext();
        const handleLeft = () => flipbookRef.current?.flipPrev();

        keyboardjs.bind('right', null, handleRight);
        keyboardjs.bind('left', null, handleLeft);
        // keyboardjs.bind('f', null, fullScreen);

        return () => {
            keyboardjs.unbind('right', null, handleRight);
            keyboardjs.unbind('left', null, handleLeft);
            // keyboardjs.unbind('f', null, fullScreen);
        };
    }, [flipbookRef]);

    return (
        <div 
            className="px-3 w-full bg-background"
            style={{ 
                padding: '0 0.75rem', 
                width: '100%', 
                backgroundColor: 'hsl(var(--background))' 
            }}
        >
            <SliderNav
                flipbookRef={flipbookRef}
                pdfDetails={pdfDetails}
                viewerStates={viewerStates}
                screenWidth={screenWidth}
            />
            <div 
                className="flex items-center gap-2 pb-2 max-xl:pt-2"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    paddingBottom: '0.5rem' 
                }}
            >
                <div className="hidden lg:block flex-1"></div>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!flipbookRef.current) {
                            return;
                        }
                        try {
                            if (screenWidth < 768) {
                                flipbookRef.current.turnToPrevPage();
                            } else {
                                flipbookRef.current.flipPrev();
                            }
                        } catch (error) {
                            console.error('Error flipping to previous page:', error);
                        }
                    }}
                    disabled={viewerStates.currentPageIndex === 0}
                    variant='secondary'
                    size='icon'
                    style={{ 
                        minWidth: '2rem', 
                        minHeight: '2rem', 
                        width: '2rem',
                        height: '2rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: viewerStates.currentPageIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    <ChevronLeft style={{ width: '1rem', height: '1rem', display: 'block' }} />
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!flipbookRef.current) {
                            return;
                        }
                        try {
                            if (screenWidth < 768) {
                                flipbookRef.current.turnToNextPage();
                            } else {
                                flipbookRef.current.flipNext();
                            }
                        } catch (error) {
                            console.error('Error flipping to next page:', error);
                        }
                    }}
                    disabled={viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2}
                    variant='secondary'
                    size='icon'
                    style={{ 
                        minWidth: '2rem', 
                        minHeight: '2rem',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: (viewerStates.currentPageIndex === pdfDetails?.totalPages - 1 || viewerStates.currentPageIndex === pdfDetails?.totalPages - 2) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <ChevronRight style={{ width: '1rem', height: '1rem', display: 'block' }} />
                </Button>
                <Zoom zoomScale={viewerStates.zoomScale} screenWidth={screenWidth} />
                <Button
                    onClick={fullScreen}
                    variant='secondary'
                    size='icon'
                    className='size-8 min-w-8'
                >
                    {screenfull && screenfull.isEnabled && screenfull.isFullscreen ?
                        <Minimize className="size-4 min-w-4" /> :
                        <Maximize className="size-4 min-w-4" />
                    }
                </Button>
                {pdfDetails?.totalPages > 0 && (
                    <p className='text-sm font-medium pr-2'>
                        {pagesInFlipView} of {pdfDetails?.totalPages}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Toolbar;

