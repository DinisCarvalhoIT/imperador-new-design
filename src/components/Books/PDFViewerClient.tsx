interface PDFViewerClientProps {
  pdfUrl: string;
  className?: string;
}

export default function PDFViewerClient({ pdfUrl, className }: PDFViewerClientProps) {
  // Paths are already properly encoded in Books.astro, so use as-is
  // If path is not encoded (for backwards compatibility), encode it
  const encodedUrl = pdfUrl.includes('%') ? pdfUrl : encodeURI(pdfUrl);
  
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

