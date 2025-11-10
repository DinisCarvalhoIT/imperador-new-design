import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./toolbar/toolbar";
import { cn } from "../lib/utils";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { Document, pdfjs } from "react-pdf";
import PdfLoading from "./pad-loading/pdf-loading";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import type { PdfDetails, ViewerStates, HTMLFlipBookRef, FlipbookViewerProps } from './types';

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ pdfUrl, className  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const flipbookRef = useRef<HTMLFlipBookRef>(null);
    const [pdfLoading, setPdfLoading] = useState<boolean>(true);
    const [pdfDetails, setPdfDetails] = useState<PdfDetails | null>(null);
    const [viewerStates, setViewerStates] = useState<ViewerStates>({
        currentPageIndex: 0,
        zoomScale: 1,
    });

    // Initialize PDF.js worker and load PDF document with preloading
    useEffect(() => {
        const loadPdfDocument = async () => {
            try {
                // Initialize PDF.js worker using locally installed package
                pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
                
                // Convert pdfUrl to a format that pdfjs.getDocument can accept
                let documentSource: string | ArrayBuffer | Uint8Array;
                
                if (pdfUrl instanceof File) {
                    // Convert File to ArrayBuffer
                    const arrayBuffer = await pdfUrl.arrayBuffer();
                    documentSource = arrayBuffer;
                } else if (typeof pdfUrl === 'object' && pdfUrl !== null && 'url' in pdfUrl) {
                    // Extract URL from { url: string } object
                    documentSource = pdfUrl.url;
                } else {
                    // String or ArrayBuffer - use directly
                    documentSource = pdfUrl as string | ArrayBuffer;
                }
                
                // Load the PDF document using async/await
                const doc = await pdfjs.getDocument(documentSource).promise;
                
                // Get the first page to extract dimensions
                const firstPage = await doc.getPage(1);
                const viewport = firstPage.getViewport({ scale: 1.0 });
                
                setPdfDetails({
                    totalPages: doc.numPages,
                    width: viewport.width,
                    height: viewport.height,
                });
                
                // Preload all PDF pages in the background
                const preloadPages = async () => {
                    const pagePromises = [];
                    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
                        pagePromises.push(
                            doc.getPage(pageNum).then(page => {
                                // Get viewport to trigger page parsing
                                page.getViewport({ scale: 1.0 });
                                return page;
                            })
                        );
                    }
                    // Wait for all pages to be loaded
                    await Promise.all(pagePromises);
                };
                
                // Start preloading pages (don't wait for it to finish before showing the viewer)
                preloadPages().catch(error => {
                    console.warn('Error preloading some PDF pages:', error);
                });
                
                setPdfLoading(false);
            } catch (error) {
                console.error('Error loading PDF document:', error);
                setPdfLoading(false);
            }
        };

        loadPdfDocument();
    }, [pdfUrl]);

    return (
        <div ref={containerRef} className={cn("relative h-full overflow-hidden", className)}>
            {pdfLoading && <PdfLoading />}
            {pdfDetails && !pdfLoading && (
                <Document file={pdfUrl} loading={<></>}>
                    <TransformWrapper
                        doubleClick={{ disabled: true }}
                        pinch={{ step: 2 }}
                        disablePadding={viewerStates?.zoomScale <= 1}
                        initialScale={1}
                        minScale={1}
                        maxScale={5}
                        onTransformed={({ state }) => setViewerStates({ ...viewerStates, zoomScale: state.scale })}
                    >
                        <div className="w-full h-screen flex flex-col">
                            <Flipbook
                                viewerStates={viewerStates}
                                setViewerStates={setViewerStates}
                                flipbookRef={flipbookRef}
                                pdfDetails={pdfDetails}
                            />
                            <Toolbar
                                viewerStates={viewerStates}
                                setViewerStates={setViewerStates}
                                containerRef={containerRef}
                                flipbookRef={flipbookRef}
                                screenfull={screenfull}
                                pdfDetails={pdfDetails}
                            />
                        </div>
                    </TransformWrapper >
                </Document>
            )}
        </div>
    );
}

export default FlipbookViewer;

