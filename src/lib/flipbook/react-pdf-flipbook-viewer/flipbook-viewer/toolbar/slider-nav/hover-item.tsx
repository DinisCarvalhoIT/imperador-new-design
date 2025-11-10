import { memo, useMemo } from 'react';
import { Page } from 'react-pdf';

interface HoverItemProps {
    slide: number | null;
    totalPages: number;
    totalSlides: number;
}

const HoverItem = memo<HoverItemProps>(({ slide, totalPages, totalSlides }) => {
    // Calculate which pages to show for this slide
    const pagesToShow = useMemo(() => {
        if (slide === null) return [];
        
        // Match the original calculation logic:
        // Left page: slide * 2 - 2 (with fallback to 1 if 0)
        // Right page: slide * 2 - 1
        const leftPage = Math.max(1, slide * 2 - 2 || 1);
        const rightPage = slide * 2 - 1;
        
        // Only show pages that exist and are valid
        const pages: number[] = [];
        if (leftPage >= 1 && leftPage <= totalPages) pages.push(leftPage);
        if (rightPage >= 1 && rightPage <= totalPages && rightPage !== leftPage) pages.push(rightPage);
        
        return pages;
    }, [slide, totalPages]);

    if (slide === null || pagesToShow.length === 0) return null;

    // Calculate page label
    const pageLabel = useMemo(() => {
        if (slide === 1 || (slide === totalSlides && totalPages % 2 === 0)) {
            return pagesToShow[0] || 1;
        }
        return pagesToShow.length === 2 ? `${pagesToShow[0]}-${pagesToShow[1]}` : `${pagesToShow[0]}`;
    }, [slide, totalSlides, totalPages, pagesToShow]);

    return (
        <div>
            <p className="text-xs text-background pb-1">
                Page {pageLabel}
            </p>
            <div className="flex rounded-md overflow-hidden">
                {/* Only render the pages we actually need - this is much faster! */}
                {pagesToShow.map((pageNumber) => (
                    <Page
                        key={pageNumber}
                        pageNumber={pageNumber}
                        width={80} // Smaller width for faster loading
                        renderAnnotationLayer={false}
                        renderForms={false}
                        renderTextLayer={false}
                        loading={<div className="w-20 h-28 bg-gray-200 animate-pulse" />}
                    />
                ))}
            </div>
        </div>
    );
});

HoverItem.displayName = 'HoverItem';
export default HoverItem;

