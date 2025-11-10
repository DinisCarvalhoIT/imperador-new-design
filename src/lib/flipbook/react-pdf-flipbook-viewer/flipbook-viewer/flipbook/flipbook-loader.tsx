import React, { forwardRef, memo, useCallback, useMemo } from "react";
import { HTMLFlipBook } from "@/lib/flipbook";
import type { PageFlip } from "@/lib/flipbook/StPageFlip-updated/src/PageFlip";
import PdfPage from "./pdf-page";
import { useDebounce } from "@/lib/flipbook/react-pdf-flipbook-viewer/hooks/use-debounce";
import { cn } from "@/lib/utils";

const MemoizedPdfPage = memo(PdfPage);

interface PdfDetails {
  totalPages: number;
  width: number;
  height: number;
}

interface ViewerStates {
  currentPageIndex: number;
  zoomScale: number;
}

interface FlipbookLoaderProps {
  pdfDetails: PdfDetails;
  scale: number;
  viewerStates: ViewerStates;
  setViewerStates: React.Dispatch<React.SetStateAction<ViewerStates>>;
  viewRange: [number, number];
  setViewRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const FlipbookLoader = forwardRef<PageFlip | undefined, FlipbookLoaderProps>(
  ({ pdfDetails, scale, viewerStates, setViewerStates }, ref) => {
    // Reduced debounce for faster high-res upgrade (200ms instead of 500ms)
    // The immediate render in PdfPage handles visual feedback, so we can be more aggressive
    const debouncedZoom = useDebounce(viewerStates.zoomScale, 200);

    const isPageInView = useCallback(
      (index: number): boolean => {
        return (
          viewerStates.currentPageIndex === index ||
          viewerStates.currentPageIndex + 1 === index
        );
      },
      [viewerStates.currentPageIndex]
    );

    // Memoize stable props that don't change often
    const stablePageProps = useMemo(
      () => ({
        height: pdfDetails.height * scale,
        zoomScale: viewerStates.zoomScale,
        debouncedZoomScale: debouncedZoom,
      }),
      [pdfDetails.height, scale, viewerStates.zoomScale, debouncedZoom]
    );

    // Create page props array - only recalculate when necessary values change
    const pageProps = useMemo(() => {
      return Array.from({ length: pdfDetails.totalPages }, (_, index) => ({
        key: index,
        ...stablePageProps,
        page: index + 1,
        isPageInViewRange: true, // Always true for pre-rendering
        isPageInView: isPageInView(index),
      }));
    }, [pdfDetails.totalPages, stablePageProps, isPageInView]);

    // Update pageViewRange on page flip >>>>>>>>
    const onFlip = useCallback(
      (e: unknown) => {
        // The flip event from PageFlip has a structure like { data: number, object: PageFlip }
        const flipEvent = e as {
          data?: number | string | boolean | object;
          object?: unknown;
        };
        const newPageIndex =
          typeof flipEvent.data === "number" ? flipEvent.data : -1;

        if (newPageIndex < 0) {
          console.warn("onFlip: Invalid page index", flipEvent);
          return;
        }

        // Use functional updates to avoid stale closure issues
        setViewerStates((prevStates) => {
          // Only update if the page actually changed
          if (prevStates.currentPageIndex === newPageIndex) {
            return prevStates; // No change, return same state to prevent re-render
          }

          return {
            ...prevStates,
            currentPageIndex: newPageIndex,
          };
        });
      },
      [setViewerStates]
    );

    // Disable mouse events for page turning when zoomed in to allow panning
    const isZoomedIn = viewerStates.zoomScale > 1;

    return (
      <div className="relative">
        <HTMLFlipBook
          ref={ref}
          key={scale}
          startPage={viewerStates.currentPageIndex}
          width={pdfDetails.width * scale * 5}
          height={pdfDetails.height * scale * 5}
          size="stretch"
          maxShadowOpacity={0.1}
          flippingTime={700}
          usePortrait={false}
          showCover={true}
          onFlip={onFlip}
          easing="ease-out"
          className={cn()}
          style={{ width: "100%", height: "100%" }}
          useMouseEvents={!isZoomedIn}
        >
          {pageProps.map((props) => (
            <MemoizedPdfPage
              key={props.key}
              height={props.height}
              zoomScale={props.zoomScale}
              debouncedZoomScale={props.debouncedZoomScale}
              page={props.page}
              isPageInViewRange={props.isPageInViewRange}
              isPageInView={props.isPageInView}
            />
          ))}
        </HTMLFlipBook>
        {/* <p className="text-background absolute z-50 top-0 -left-10">{viewRange[0] + '-' + viewRange[1]}</p> */}
      </div>
    );
  }
);

FlipbookLoader.displayName = "FlipbookLoader";

export default FlipbookLoader;
