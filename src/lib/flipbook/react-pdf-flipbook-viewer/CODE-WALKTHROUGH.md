# Code Walkthrough: Re-rendering Logic

## Step-by-Step Code Flow

### Step 1: Zoom Detection
**File**: `flipbook-viewer.tsx`

```typescript
// Line 53: Zoom change detected by TransformWrapper
onTransformed={({ state }) => setViewerStates({ ...viewerStates, zoomScale: state.scale })}
```

When user zooms, this callback immediately updates `viewerStates.zoomScale`.

---

### Step 2: Debouncing
**File**: `flipbook-loader.tsx`

```typescript
// Line 32: Debounce zoom to prevent excessive re-renders
const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);
```

The `useDebounce` hook waits 500ms after zoom stops before updating. This prevents re-rendering on every zoom frame.

**Implementation** (`hooks/use-debounce.ts`):
```typescript
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}
```

---

### Step 3: Page Visibility Check
**File**: `flipbook-loader.tsx`

```typescript
// Lines 35-40: Determine if page should be rendered
const isPageInViewRange = (index: number): boolean => { 
    return index >= viewRange[0] && index <= viewRange[1] 
};

const isPageInView = (index: number): boolean => { 
    return viewerStates.currentPageIndex === index || viewerStates.currentPageIndex + 1 === index 
};
```

- `isPageInViewRange`: Page is within the loading range (optimization)
- `isPageInView`: Page is currently visible (for high-res rendering)

---

### Step 4: Conditional High-Resolution Rendering
**File**: `pdf-page.tsx` - **THE KEY LINE**

```typescript
// Line 19: The magic happens here!
devicePixelRatio={
    (isPageInView && zoomScale > 1.7) 
        ? Math.min(zoomScale * window.devicePixelRatio, 5) 
        : window.devicePixelRatio
}
```

**Breaking down the condition:**

```typescript
// Part 1: Check if high-res is needed
isPageInView && zoomScale > 1.7

// Part 2a: If TRUE → Calculate high resolution
Math.min(zoomScale * window.devicePixelRatio, 5)
// Example: zoomScale=2.5, devicePixelRatio=2 → min(5, 5) = 5x resolution

// Part 2b: If FALSE → Use default
window.devicePixelRatio
// Example: devicePixelRatio=2 → 2x resolution (standard)
```

**Why this works:**
- `devicePixelRatio` tells `react-pdf`'s `Page` component what resolution to render at
- Higher `devicePixelRatio` = sharper image, but more memory
- The condition ensures we only use high-res when:
  1. Page is visible (`isPageInView`)
  2. Content is hard to see (`zoomScale > 1.7`)

---

### Step 5: React Re-render
**File**: `pdf-page.tsx`

```typescript
// Lines 17-24: Conditional rendering
{isPageInViewRange && (
    <Page
        devicePixelRatio={...}  // ← This prop change triggers re-render
        height={height}
        pageNumber={page}
        loading={<></>}
    />
)}
```

When `devicePixelRatio` changes, React's `Page` component from `react-pdf`:
1. Detects the prop change
2. Re-renders the PDF page at the new resolution
3. The browser displays the sharper image

---

## Visual Example

### Before Zoom (zoomScale = 1.0)
```
devicePixelRatio = window.devicePixelRatio (e.g., 2)
→ Standard resolution render
→ Fast, good for overview
```

### During Zoom (zoomScale = 2.5, debouncing...)
```
zoomScale updates → debouncedZoom still = 1.0 (waiting 500ms)
→ No re-render yet (performance optimization)
```

### After Zoom Settles (zoomScale = 2.5, after 500ms)
```
Condition: isPageInView && 2.5 > 1.7 → TRUE
devicePixelRatio = Math.min(2.5 * 2, 5) = 5
→ High-resolution re-render triggered
→ Sharp, readable content!
```

---

## Complete Data Flow

```
┌─────────────────────────────────────────┐
│ User zooms in (pinch/scroll)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ TransformWrapper.onTransformed           │
│ → viewerStates.zoomScale = 2.5          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ FlipbookLoader receives zoomScale        │
│ → useDebounce(zoomScale, 500)            │
│ → debouncedZoom = 2.5 (after 500ms)     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ PdfPage receives debouncedZoom prop      │
│ → isPageInView && 2.5 > 1.7?            │
│ → YES: devicePixelRatio = 5             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ react-pdf Page component                 │
│ → Re-renders at 5x resolution           │
│ → Sharp, readable content displayed     │
└─────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Threshold-based**: Only triggers high-res when `zoomScale > 1.7`
2. **Debounced**: Waits 500ms to avoid excessive renders
3. **Conditional**: Only applies to visible pages
4. **Capped**: Maximum 5x resolution to prevent memory issues
5. **Automatic**: User doesn't need to do anything - it just works!

