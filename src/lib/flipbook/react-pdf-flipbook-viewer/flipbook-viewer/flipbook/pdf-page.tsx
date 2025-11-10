import { cn } from "../../lib/utils";
import {
  forwardRef,
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Page } from "react-pdf";

interface PdfPageProps {
  page: number;
  height: number;
  zoomScale: number;
  debouncedZoomScale: number;
  isPageInView: boolean;
  isPageInViewRange: boolean;
}

// Constants
const HIGH_RES_THRESHOLD = 1.2;
const MAX_DPR = 5;

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(
  (
    { page, height, debouncedZoomScale, isPageInView, isPageInViewRange },
    ref
  ) => {
    const defaultDpr = window.devicePixelRatio || 1;

    // Calculate DPR directly based on zoom - instant updates like Chrome
    const currentDpr = useMemo(() => {
      const needsHighRes =
        isPageInView && debouncedZoomScale > HIGH_RES_THRESHOLD;
      return needsHighRes
        ? Math.min(debouncedZoomScale * defaultDpr, MAX_DPR)
        : defaultDpr;
    }, [isPageInView, debouncedZoomScale, defaultDpr]);

    // Chrome-style page swapping: keep old page visible until new one is ready, then instant swap
    const [displayedPage, setDisplayedPage] = useState(page);
    const [displayedDpr, setDisplayedDpr] = useState(currentDpr);
    const [newPageReady, setNewPageReady] = useState(false);
    const newPageCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevPageRef = useRef(page);
    const prevDprRef = useRef(currentDpr);

    // When page or DPR changes, prepare new page in background
    useEffect(() => {
      const pageChanged = prevPageRef.current !== page;
      const dprChanged = Math.abs(prevDprRef.current - currentDpr) > 0.01;

      if (pageChanged || dprChanged) {
        prevPageRef.current = page;
        prevDprRef.current = currentDpr;
        setNewPageReady(false);
        newPageCanvasRef.current = null;
      }
    }, [page, currentDpr]);

    // When new page is ready, wait for browser to paint canvas before swapping
    // This prevents blank flash - wait 2 frames to ensure canvas is painted to screen
    const handleRenderSuccess = useCallback(() => {
      // Wait for browser to paint the canvas (2 frames ensures it's visible)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Now swap instantly - canvas should be painted
          setDisplayedPage(page);
          setDisplayedDpr(currentDpr);
          setNewPageReady(true);
        });
      });
    }, [page, currentDpr]);

    const handleRenderError = useCallback(
      (error: Error) => {
        console.error("Page render error:", error);
        // On error, still swap to avoid stuck state
        setDisplayedPage(page);
        setDisplayedDpr(currentDpr);
        setNewPageReady(true);
      },
      [page, currentDpr]
    );

    // Callback to get canvas ref when Page component renders it
    const handleCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
      newPageCanvasRef.current = canvas;
    }, []);

    // Background styling
    const isEvenPage = page % 2 === 0;
    const bgColor = isEvenPage ? "bg-background" : "bg-muted";
    const bgColorValue = isEvenPage ? "var(--background)" : "var(--muted)";

    const containerStyle = {
      minHeight: height,
      opacity: isPageInViewRange ? 1 : 0.3,
    };

    const pageContainerStyle = {
      height,
      backgroundColor: bgColorValue,
    };

    const LoadingIndicator = () => (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        style={{ height, backgroundColor: bgColorValue }}
      >
        {/* Animated spinner with pulsing effect */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 border-4 border-primary/30 border-t-transparent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        {/* Skeleton shimmer effect */}
        <div className="w-3/4 max-w-xs space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/30 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="absolute inset-0 bg-linear-to-r from-transparent via-primary/30 to-transparent animate-shimmer"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="absolute inset-0 bg-linear-to-rfrom-transparent via-primary/30 to-transparent animate-shimmer"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>
      </div>
    );

    // Always render pages, even if not in view range (for pre-rendering)
    if (!isPageInViewRange) {
      return (
        <div
          ref={ref}
          className={cn("relative", bgColor)}
          style={containerStyle}
        />
      );
    }

    // Chrome-style instant rendering: keep old page visible until new one is ready, then instant swap
    const needsNewPage =
      displayedPage !== page || Math.abs(displayedDpr - currentDpr) > 0.01;
    const showOldPage = needsNewPage && !newPageReady;

    return (
      <div ref={ref} className={cn("relative", bgColor)} style={containerStyle}>
        <div
          className={cn("relative w-full overflow-hidden", bgColor)}
          style={pageContainerStyle}
        >
          {/* Currently displayed page - stays visible until new one is ready */}
          {showOldPage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColorValue,
                opacity: 1,
                zIndex: 1,
                pointerEvents: "none",
                transition: "none", // No transition - instant swap
              }}
            >
              <Page
                key={`displayed-${displayedPage}-dpr-${displayedDpr.toFixed(
                  2
                )}`}
                devicePixelRatio={displayedDpr}
                height={height}
                pageNumber={displayedPage}
                loading={null}
              />
            </div>
          )}

          {/* New page being prepared - becomes visible instantly when ready */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: bgColorValue,
              opacity: showOldPage ? 0 : 1,
              zIndex: 2,
              pointerEvents: "auto",
              transition: "none", // No transition - instant swap
              visibility: showOldPage ? "hidden" : "visible", // Hide completely when old page is showing
            }}
          >
            <Page
              key={`new-${page}-dpr-${currentDpr.toFixed(2)}`}
              devicePixelRatio={currentDpr}
              height={height}
              pageNumber={page}
              canvasRef={needsNewPage ? handleCanvasRef : undefined}
              loading={
                needsNewPage && !newPageReady ? <LoadingIndicator /> : null
              }
              onRenderSuccess={needsNewPage ? handleRenderSuccess : undefined}
              onRenderError={needsNewPage ? handleRenderError : undefined}
            />
          </div>
        </div>
      </div>
    );
  }
);

PdfPage.displayName = "PdfPage";

// Memo comparison: only re-render on significant prop changes
const arePropsEqual = (
  prevProps: PdfPageProps,
  nextProps: PdfPageProps
): boolean => {
  // Critical props that always trigger re-render
  if (
    prevProps.page !== nextProps.page ||
    prevProps.height !== nextProps.height
  ) {
    return false;
  }

  // Only re-render if isPageInViewRange changes from false to true or vice versa
  // (not just any change, since we're pre-rendering all pages)
  if (prevProps.isPageInViewRange !== nextProps.isPageInViewRange) {
    return false;
  }

  // Check high-res threshold crossing - only re-render if crossing the threshold
  // This prevents re-renders when isPageInView changes but high-res status doesn't
  const prevNeedsHighRes =
    prevProps.isPageInView && prevProps.debouncedZoomScale > HIGH_RES_THRESHOLD;
  const nextNeedsHighRes =
    nextProps.isPageInView && nextProps.debouncedZoomScale > HIGH_RES_THRESHOLD;

  if (prevNeedsHighRes !== nextNeedsHighRes) {
    return false;
  }

  // Only re-render on significant zoom changes (>0.05)
  // Also check if zoomScale changed significantly (for immediate feedback)
  const zoomChangeThreshold = 0.05;
  if (
    Math.abs(prevProps.debouncedZoomScale - nextProps.debouncedZoomScale) >
    zoomChangeThreshold
  ) {
    return false;
  }

  // Don't re-render just because isPageInView changed if high-res status is the same
  // This prevents unnecessary re-renders when flipping pages while zoomed
  if (prevProps.isPageInView !== nextProps.isPageInView) {
    // Only re-render if it affects high-res rendering
    if (prevNeedsHighRes || nextNeedsHighRes) {
      return false; // Need to re-render to update DPR
    }
    // If high-res is not needed, isPageInView change doesn't matter
    // (DPR will be the same regardless)
  }

  return true;
};

export default memo(PdfPage, arePropsEqual);
