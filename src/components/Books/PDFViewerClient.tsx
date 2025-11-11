interface PDFViewerClientProps {
  pdfUrl: string;
  className?: string;
}

export default function PDFViewerClient({ pdfUrl, className }: PDFViewerClientProps) {
  // URL encode the path to handle spaces and special characters
  const encodedUrl = encodeURI(pdfUrl);
  
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <iframe
        src={encodedUrl}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
}

