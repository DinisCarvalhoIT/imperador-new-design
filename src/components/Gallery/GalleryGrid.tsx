import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: string[];
}

interface ThumbnailProps {
  image: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}

function Thumbnail({ image, index, selected, onClick }: ThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer",
        "ring-0 focus:ring-2 focus:ring-white/50 focus:outline-none",
        selected
          ? "border-white opacity-100 scale-105 shadow-lg shadow-white/20"
          : "border-transparent opacity-60 hover:opacity-90 hover:scale-[1.02]"
      )}
      type="button"
      aria-label={`View image ${index + 1}`}
    >
      <img
        src={image}
        alt={`Thumbnail ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-200"
        loading="lazy"
      />
      {selected && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      )}
    </button>
  );
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  // Sync thumbnails when main carousel changes
  useEffect(() => {
    if (!mainApi || !thumbApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setSelectedIndex(index);
      thumbApi.scrollTo(index);
    };

    mainApi.on("select", onSelect);
    onSelect(); // Initial sync

    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi]);

  // Scroll main carousel when thumbnail is clicked
  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi]
  );

  // Initialize carousel when dialog opens
  useEffect(() => {
    if (open && mainApi) {
      mainApi.scrollTo(selectedIndex, false);
    }
  }, [open, mainApi, selectedIndex]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="relative">
          {/* Gallery Grid Layout */}
          <div className="w-full mx-auto">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full pb-3">
              {/* Large Image Left */}
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

              {/* Right Stack - Two Images */}
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

            {/* Row 2 */}
            <div className="flex flex-col lg:flex-row items-start gap-3 w-full">
              {/* Left Grid - 4 Images */}
              <div className="flex flex-row flex-wrap gap-3 flex-none w-full lg:w-[68.13%]">
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
            className="absolute bottom-4 right-4 cursor-pointer hover:opacity-90 transition-opacity z-10"
            aria-label="Open gallery"
            type="button"
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

        {/* Dialog Content with Carousel */}
        <DialogContent className="max-w-[98vw]! w-full sm:max-w-[98vw]! md:max-w-[98vw]! lg:max-w-[98vw]! xl:max-w-[98vw]! h-full bg-transparent border-none p-0 sm:p-1 md:p-2 flex flex-col">
          {/* Main Carousel */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative pt-4 sm:pt-6 md:pt-8 lg:pt-10">
            <Carousel
              setApi={setMainApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full h-full max-w-full"
            >
              <CarouselContent className="ml-0 h-full flex items-center pt-2 sm:pt-4">
                {images.map((image, index) => (
                  <CarouselItem
                    key={`main-${index}`}
                    className="flex items-center justify-center w-full h-full pl-0 basis-full"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                        loading={index <= 1 ? "eager" : "lazy"}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious 
                size="icon"
                className="absolute cursor-pointer left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 z-10 disabled:opacity-100 disabled:pointer-events-auto" 
              />
              <CarouselNext 
                size="icon"
                className="absolute cursor-pointer right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 z-10 disabled:opacity-100 disabled:pointer-events-auto" 
              />
            </Carousel>
          </div>

          {/* Thumbnail Carousel */}
          <div className="w-full py-4 sm:py-5 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8 shrink-0 overflow-visible">
            <Carousel
              setApi={setThumbApi}
              opts={{
                align: "center",
                containScroll: "keepSnaps",
                dragFree: true,
              }}
              className="w-full max-w-full overflow-visible"
            >
              <CarouselContent className="ml-0 gap-2 sm:gap-3 justify-center items-center px-2 sm:px-3 md:px-4 py-2 overflow-visible">
                {images.map((image, index) => (
                  <CarouselItem
                    key={`thumb-${index}`}
                    className="pl-0 basis-auto overflow-visible"
                  >
                    <Thumbnail
                      image={image}
                      index={index}
                      selected={index === selectedIndex}
                      onClick={() => handleThumbClick(index)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
