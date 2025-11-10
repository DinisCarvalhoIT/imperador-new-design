import React, { memo, useState, useEffect, useCallback } from 'react';
import useRefSize from '@/lib/flipbook/react-pdf-flipbook-viewer/hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from '@/lib/utils';
import { TransformComponent } from 'react-zoom-pan-pinch';
import screenfull from 'screenfull';
import type { HTMLFlipBookRef, PdfDetails, ViewerStates } from '../types';

interface FlipbookProps {
    viewerStates: ViewerStates;
    setViewerStates: React.Dispatch<React.SetStateAction<ViewerStates>>;
    flipbookRef: React.RefObject<HTMLFlipBookRef | null>;
    pdfDetails: PdfDetails;
}

const Flipbook = memo<FlipbookProps>(({ viewerStates, setViewerStates, flipbookRef, pdfDetails }) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState<number>(1); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState<React.CSSProperties>({});
    // Initialize viewRange to include all pages for pre-rendering
    const [viewRange, setViewRange] = useState<[number, number]>([0, Math.max(0, pdfDetails?.totalPages - 1 || 0)]);

    // Calculate scale when pageSize or dimensions change >>>>>>>>
    useEffect(() => {
        if (pdfDetails && width && height) {
            const calculatedScale = Math.min(
                width / (2 * pdfDetails.width),
                height / pdfDetails.height
            );
            setScale(calculatedScale);
            setWrapperCss({
                width: `${pdfDetails.width * calculatedScale * 2}px`,
                height: `${pdfDetails.height * calculatedScale}px`,
            });
            // Update viewRange to include all pages when PDF details are loaded
            setViewRange([0, Math.max(0, pdfDetails.totalPages - 1)]);
        }
    }, [pdfDetails, width, height]);

    // Refresh flipbook size & page range on window resize >>>>>>>>
    // Note: All pages are pre-rendered, so we keep viewRange at all pages
    const shrinkPageLoadingRange = useCallback(() => {
        // Keep all pages in viewRange for pre-rendering
        setViewRange([0, Math.max(0, pdfDetails.totalPages - 1)]);
    }, [pdfDetails.totalPages]);

    const handleFullscreenChange = useCallback(() => {
        shrinkPageLoadingRange();
        refreshSize();
    }, [shrinkPageLoadingRange, refreshSize]);

    useEffect(() => {
        if (screenfull) {
            screenfull.on('change', handleFullscreenChange);
        }
        // Clean up the event listener
        return () => {
            if (screenfull) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, [handleFullscreenChange]);

    return (
        <div ref={ref} className={cn("relative flex-1 w-full bg-transparent flex justify-center items-center overflow-hidden min-h-0", screenfull?.isFullscreen && 'h-[calc(100vh-5.163rem)] xs:h-[calc(100vh-5.163rem)] lg:h-[calc(100vh-5.163rem)] xl:h-[calc(100vh-4.66rem)] flex-none')}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                <div className='overflow-hidden flex justify-center items-center h-full w-full'>
                    {pdfDetails && scale && (
                        <div style={wrapperCss}>
                            <FlipbookLoader
                                ref={flipbookRef}
                                pdfDetails={pdfDetails}
                                scale={scale}
                                viewRange={viewRange}
                                setViewRange={setViewRange}
                                viewerStates={viewerStates}
                                setViewerStates={setViewerStates}
                            />
                        </div>
                    )}
                </div>
            </TransformComponent>
        </div>
    );
});

Flipbook.displayName = 'Flipbook';
export default Flipbook;

