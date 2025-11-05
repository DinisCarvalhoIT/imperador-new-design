import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";

interface GalleryGridProps {
  images: string[];
}

interface CarouselButtonProps extends React.ComponentProps<typeof Button> {
  onClick: () => void;
  disabled?: boolean;
}

function CarouselPrevious({
  className,
  onClick,
  disabled,
  ...props
}: CarouselButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("absolute size-9 rounded-full", className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.418448 5.70577L5.56049 11.0036L6.01611 10.5118L1.35139 5.70577L6.01611 0.899696L5.56049 0.430265L0.418448 5.70577Z"
          fill="white"
          stroke="white"
          strokeWidth="0.6"
        />
      </svg>
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  onClick,
  disabled,
  ...props
}: CarouselButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("absolute size-9 rounded-full", className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.01563 5.70577L0.873593 11.0036L0.417969 10.5118L5.08269 5.70577L0.417969 0.899696L0.873593 0.430265L6.01563 5.70577Z"
          fill="white"
          stroke="white"
          strokeWidth="0.6"
        />
      </svg>
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

interface ThumbProps {
  selected: boolean;
  onClick: () => void;
  image: string;
  index: number;
}

function Thumb({ selected, onClick, image, index }: ThumbProps) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border-2 p-0 ${
        selected
          ? "border-white opacity-100"
          : "border-transparent opacity-50 hover:opacity-70"
      }`}
      type="button"
    >
      <img
        src={image}
        alt={`Thumbnail ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </button>
  );
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoHeightPlugin = React.useMemo(() => AutoHeight(), []);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: false,
    },
    [autoHeightPlugin]
  );
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const scrollPrev = React.useCallback(() => {
    emblaMainApi?.scrollPrev(false);
  }, [emblaMainApi]);

  const scrollNext = React.useCallback(() => {
    emblaMainApi?.scrollNext(false);
  }, [emblaMainApi]);

  const onThumbClick = React.useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index, false);
    },
    [emblaMainApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
    emblaThumbsApi.scrollTo(index, false);
  }, [emblaMainApi, emblaThumbsApi]);

  React.useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  React.useEffect(() => {
    if (!open || !emblaMainApi) return;
    emblaMainApi.reInit();
    if (selectedIndex !== emblaMainApi.selectedScrollSnap()) {
      emblaMainApi.scrollTo(selectedIndex, false);
    }
  }, [open, emblaMainApi, selectedIndex]);

  // Map images: [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8]
  // Row 1: gallery1 (large), gallery2 (top), gallery3 (bottom)
  // Row 2: gallery4, gallery5, gallery6, gallery7 (grid), gallery8 (large right)

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="">
          {/* Gallery Layout Container */}
          <div className="w-full mx-auto">
            {/* Row 1: 825px + 12px gap + 575px = 1412px */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full pb-3">
              {/* Large Image Left - 825px / 1412px = 58.43% */}
              <div
                className="relative flex-none cursor-pointer group w-full sm:w-[58.43%] overflow-hidden"
                onClick={() => handleImageClick(0)}
              >
                <img
                  src={images[0]}
                  alt="Gallery image 1"
                  className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>

              {/* Right Stack - Two Images - 575px / 1412px = 40.72% */}
              <div className="flex flex-col gap-3 flex-none w-full sm:w-[40.72%]">
                <div
                  className="relative cursor-pointer group overflow-hidden"
                  style={{ aspectRatio: "575 / 280" }}
                  onClick={() => handleImageClick(1)}
                >
                  <img
                    src={images[1]}
                    alt="Gallery image 2"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>
                <div
                  className="relative cursor-pointer group overflow-hidden"
                  style={{ aspectRatio: "575 / 280" }}
                  onClick={() => handleImageClick(2)}
                >
                  <img
                    src={images[2]}
                    alt="Gallery image 3"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: 962px + 12px gap + 450px = 1424px, but container is 1412px */}
            {/* Actually: The grid is 962px, right image is 450px, total 1412px, so gap is internal to grid */}
            <div className="flex flex-col lg:flex-row items-start gap-3 w-full">
              {/* Left Grid - 4 Images - 962px / 1412px = 68.13% */}
              <div className="flex flex-row flex-wrap gap-3 flex-none w-full lg:w-[68.13%]">
                {/* Image 1 - Top Left Large - 575px / 962px = 59.77% */}
                <div
                  className="relative cursor-pointer group"
                  style={{
                    width: "59.77%",
                    aspectRatio: "575 / 281",
                  }}
                  onClick={() => handleImageClick(3)}
                >
                  <img
                    src={images[3]}
                    alt="Gallery image 4"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>

                {/* Image 2 - Top Right Medium - 363px / 962px = 37.73% */}
                <div
                  className="relative cursor-pointer group"
                  style={{
                    width: "37.73%",
                    aspectRatio: "363 / 281",
                  }}
                  onClick={() => handleImageClick(4)}
                >
                  <img
                    src={images[4]}
                    alt="Gallery image 5"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>

                {/* Image 3 - Bottom Left Small - 308px / 962px = 31.99% */}
                <div
                  className="relative cursor-pointer group"
                  style={{
                    width: "31.99%",
                    aspectRatio: "308 / 282",
                  }}
                  onClick={() => handleImageClick(5)}
                >
                  <img
                    src={images[5]}
                    alt="Gallery image 6"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>

                {/* Image 4 - Bottom Right Wide - 630px / 962px = 65.49% */}
                <div
                  className="relative cursor-pointer group"
                  style={{
                    width: "65.49%",
                    aspectRatio: "630 / 281",
                  }}
                  onClick={() => handleImageClick(6)}
                >
                  <img
                    src={images[6]}
                    alt="Gallery image 7"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Large Image Right */}
              <div
                className="relative flex-none cursor-pointer group w-full lg:w-[31.87%] overflow-hidden"
                style={{ aspectRatio: "450 / 575" }}
                onClick={() => handleImageClick(7)}
              >
                <img
                  src={images[7]}
                  alt="Gallery image 8"
                  className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Pagination Button */}
          <button
            onClick={() => {
              setSelectedIndex(0);
              setOpen(true);
            }}
            className="absolute bottom-0 right-0 cursor-pointer hover:opacity-90 transition-opacity z-10"
            aria-label="Open gallery"
          >
            <svg
              width="51"
              height="51"
              viewBox="0 0 51 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="51"
                height="51"
                rx="25.5"
                fill="white"
                fillOpacity="0.8"
              />
              <path
                d="M26.4898 17H24.5102V24.546H17V26.5033H24.5102V34H26.4898V26.5033H34V24.546H26.4898V17Z"
                fill="#024C67"
              />
            </svg>
          </button>
        </div>

        <DialogContent className="!max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 bg-transparent border-none flex flex-col">
          <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-hidden min-h-0 relative">
            <div
              className="embla__viewport overflow-hidden w-full h-full"
              ref={emblaMainRef}
            >
              <div className="embla__container flex">
                {images.map((image, index) => (
                  <div
                    key={`slide-${index}`}
                    className="embla__slide shrink-0 w-full flex items-center justify-center"
                    style={{ minWidth: "100%" }}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                      loading={index <= 1 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
            <CarouselPrevious
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="left-4 top-1/2 -translate-y-1/2 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 disabled:opacity-100 disabled:pointer-events-auto"
            />
            <CarouselNext
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="right-4 top-1/2 -translate-y-1/2 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 disabled:opacity-100 disabled:pointer-events-auto"
            />
          </div>

          <div className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md">
            <div
              className="embla-thumbs__viewport overflow-hidden w-full"
              ref={emblaThumbsRef}
            >
              <div className="embla-thumbs__container flex gap-2 items-center justify-center py-2">
                {images.map((image, index) => (
                  <Thumb
                    key={`thumb-${index}`}
                    onClick={() => onThumbClick(index)}
                    selected={index === selectedIndex}
                    image={image}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
