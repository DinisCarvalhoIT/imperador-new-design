import { useState, useEffect, type ComponentType } from 'react';
import type { FlipbookViewerProps } from '@/lib/flipbook/react-pdf-flipbook-viewer/flipbook-viewer/types';

// Loading placeholder component
const LoadingPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-foreground">
    <div className="text-white">Loading Book...</div>
  </div>
);

// Wrapper that dynamically loads FlipbookViewer
export default function FlipbookViewerClient(props: FlipbookViewerProps) {
  const [FlipbookViewer, setFlipbookViewer] = useState<ComponentType<FlipbookViewerProps> | null>(null);

  useEffect(() => {
    // Dynamically import FlipbookViewer
    const loadFlipbookViewer = async () => {
      try {
        const module = await import('@/lib/flipbook/react-pdf-flipbook-viewer/flipbook-viewer');
        setFlipbookViewer(() => module.FlipbookViewer);
      } catch (error) {
        console.error('Error loading FlipbookViewer:', error);
      }
    };

    loadFlipbookViewer();
  }, []);

  // Show loading state while loading
  if (!FlipbookViewer) {
    return <LoadingPlaceholder />;
  }

  return <FlipbookViewer {...props} />;
}

