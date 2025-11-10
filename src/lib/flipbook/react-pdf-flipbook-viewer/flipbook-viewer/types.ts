export interface PdfDetails {
    totalPages: number;
    width: number;
    height: number;
}

export interface ViewerStates {
    currentPageIndex: number;
    zoomScale: number;
}

import type { PageFlip } from '@/lib/flipbook/StPageFlip-updated/src/PageFlip';

export type HTMLFlipBookRef = PageFlip | undefined;

export interface FlipbookViewerProps {
    pdfUrl: string | File | { url: string } | ArrayBuffer;
    className?: string;
    disableShare?: boolean;
}

