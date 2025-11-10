interface PDFViewerClientProps {
  pdfUrl: string;
  className?: string;
}

export default function PDFViewerClient({ pdfUrl, className }: PDFViewerClientProps) {
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

