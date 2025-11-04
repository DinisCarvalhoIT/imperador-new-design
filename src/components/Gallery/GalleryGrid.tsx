import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

interface GalleryGridProps {
  images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || !open) return;
    api.scrollTo(currentIndex, false);
  }, [api, currentIndex, open]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  // Layout structure: 8 images arranged in 2 rows
  // Row 1: Large image + 2 stacked images
  // Row 2: 4 images in flex-wrap grid + 1 large image
  const row1Images = images.slice(0, 3); // First 3 images
  const row2Images = images.slice(3, 8); // Remaining 5 images

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-3">
        {/* Row 1: Large image + 2 stacked images */}
        <div className="flex flex-col md:flex-row items-start gap-3">
          {/* Large image on left */}
          <div
            className="cursor-pointer flex-none w-full md:w-[825px] md:max-w-[825px]"
            onClick={() => handleImageClick(0)}
          >
            <img
              src={row1Images[0]}
              alt="Gallery image 1"
              className="w-full h-auto max-h-[572px] object-cover shadow-[0px_2.25px_36px_rgba(0,0,0,0.05)]"
              loading="lazy"
            />
          </div>
          
          {/* Stacked images on right */}
          <div className="flex flex-col gap-3 flex-none w-full md:w-[575px] md:max-w-[575px]">
            <div
              className="cursor-pointer"
              onClick={() => handleImageClick(1)}
            >
              <img
                src={row1Images[1]}
                alt="Gallery image 2"
                className="w-full h-auto max-h-[287px] object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleImageClick(2)}
            >
              <img
                src={row1Images[2]}
                alt="Gallery image 3"
                className="w-full h-auto max-h-[272px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Row 2: 4 images in flex-wrap grid + 1 large image */}
        <div className="flex flex-col md:flex-row items-start gap-3">
          {/* Flex-wrap grid on left */}
          <div className="flex flex-row flex-wrap items-start content-start gap-3 flex-none w-full md:w-[962px] md:max-w-[962px]">
            <div
              className="cursor-pointer flex-none w-full md:w-[575px] md:max-w-[575px]"
              onClick={() => handleImageClick(3)}
            >
              <img
                src={row2Images[0]}
                alt="Gallery image 4"
                className="w-full h-auto max-h-[281px] object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="cursor-pointer flex-none w-full md:w-[363px] md:max-w-[363px]"
              onClick={() => handleImageClick(4)}
            >
              <img
                src={row2Images[1]}
                alt="Gallery image 5"
                className="w-full h-auto max-h-[281px] object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="cursor-pointer flex-none w-full md:w-[308px] md:max-w-[308px]"
              onClick={() => handleImageClick(5)}
            >
              <img
                src={row2Images[2]}
                alt="Gallery image 6"
                className="w-full h-auto max-h-[282px] object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="cursor-pointer flex-none w-full md:w-[630px] md:max-w-[630px]"
              onClick={() => handleImageClick(6)}
            >
              <img
                src={row2Images[3]}
                alt="Gallery image 7"
                className="w-full h-auto max-h-[281px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Large image on right */}
          <div
            className="cursor-pointer flex-none w-full md:w-[450px] md:max-w-[450px]"
            onClick={() => handleImageClick(7)}
          >
            <img
              src={row2Images[4]}
              alt="Gallery image 8"
              className="w-full h-auto max-h-[575px] object-cover shadow-[0px_2.25px_36px_rgba(0,0,0,0.05)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 bg-black/90 border-none">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full ml-0">
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-full pl-0 basis-full">
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white/90" />
          <CarouselNext className="right-4 bg-white/80 hover:bg-white/90" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
