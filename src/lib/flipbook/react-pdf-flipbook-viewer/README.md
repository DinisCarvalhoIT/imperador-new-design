# React PDF Flipbook Viewer - TypeScript

This is a TypeScript conversion of the `react-pdf-flipbook-viewer` library.

## Structure

- `flipbook-viewer/` - Main flipbook viewer component and related components
- `hooks/` - Custom React hooks (use-debounce, use-ref-size, use-screensize)
- `lib/` - Utility functions (cn for className merging)

## Dependencies

This library requires the following dependencies (from the original library):

- `react-pdf` - For PDF rendering
- `react-zoom-pan-pinch` - For zoom and pan functionality
- `screenfull` - For fullscreen support
- `keyboardjs` - For keyboard shortcuts
- `lucide-react` - For icons
- `react-draggable` - For draggable slider
- `clsx` and `tailwind-merge` - For className utilities

## UI Components

The library imports `Button` components from shadcn/ui. These should be available in your project's UI folder:

- `../../ui/button` - Button component

## Usage

```tsx
import { FlipbookViewer } from './react-pdf-flipbook-viewer-typescript/flipbook-viewer';

<FlipbookViewer 
  pdfUrl="/path/to/file.pdf"
  shareUrl="https://example.com"
  disableShare={false}
  className="custom-class"
/>
```

## TypeScript Types

All types are exported from `flipbook-viewer/types.ts`:

- `FlipbookViewerProps` - Props for the main component
- `PdfDetails` - PDF document details
- `ViewerStates` - Viewer state interface
- `HTMLFlipBookRef` - Ref type for the flipbook component

