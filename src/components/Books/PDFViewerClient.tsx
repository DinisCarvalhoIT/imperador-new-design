interface PDFViewerClientProps {
  pdfUrl: string;
  className?: string;
}

export default function PDFViewerClient({ pdfUrl, className }: PDFViewerClientProps) {
  // No encoding needed - PDF paths have no spaces and are served directly from public folder
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
}

