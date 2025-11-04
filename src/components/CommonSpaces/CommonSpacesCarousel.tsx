import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

interface CommonSpace {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface CommonSpacesCarouselProps {
  spaces: CommonSpace[];
  initialActiveIndex?: number;
}

export default function CommonSpacesCarousel({
  spaces,
  initialActiveIndex = 0,
}: CommonSpacesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [api, setApi] = useState<CarouselApi>();

  // Sync carousel when activeIndex changes
  useEffect(() => {
    if (!api) return;
    api.scrollTo(activeIndex);
  }, [api, activeIndex]);

  // Sync activeIndex when carousel is manually navigated
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveIndex(selectedIndex);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleSpaceClick = (index: number) => {
    setActiveIndex(index);
  };

  const getTitleColor = (index: number) => {
    if (index === activeIndex) return "text-white";
    if (index === activeIndex + 1 || index === activeIndex - 1) {
      return "text-[#5D7B89]";
    }
    return "text-[rgba(113,146,162,0.8)]";
  };

  const getDescriptionColor = (index: number) => {
    if (index === activeIndex) return "text-[#B0C4CC]";
    if (index === activeIndex + 1 || index === activeIndex - 1) {
      return "text-[#203640]";
    }
    return "text-[rgba(113,146,162,0.21)]";
  };

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
        {/* Left Column - Text Content */}
        <div className="relative pl-8 lg:pl-[106px] xl:pl-[195px] pr-8 lg:pr-16 xl:pr-24 pb-12 lg:py-16 min-w-0">
          {/* Continuous Left Border Line - Static background */}
          <div className="hidden lg:block absolute left-[106px] top-0 bottom-0 w-1">
            {/* Static background line - no highlighting */}
            <div className="absolute inset-0 bg-[rgba(74,125,145,0.7)]" />
            {/* Sliding indicator that moves up and down */}
            <div
              className="absolute left-0 w-full bg-[#FFF8F6] transition-all duration-500 ease-in-out"
              style={{
                top: `${(activeIndex / spaces.length) * 100}%`,
                height: `${(1 / spaces.length) * 100}%`,
              }}
            />
          </div>
          
          <div className="space-y-10 lg:space-y-[100px]">
            {spaces.map((space, index) => (
              <div
                key={space.id}
                className="relative cursor-pointer transition-all duration-300 group"
                onClick={() => handleSpaceClick(index)}
              >
                {/* Content */}
                <div>
                  <h3
                    className={`font-playfairDisplay text-[26px] lg:text-[56px] leading-[68px]  md:mb-4 transition-colors duration-300 ${getTitleColor(
                      index
                    )}`}
                  >
                    {space.title}
                  </h3>
                  <p
                    className={`font-montserrat text-[11px] lg:text-[18px] leading-[140%] max-w-3/4 lg:max-w-[627px] transition-colors duration-300 ${getDescriptionColor(
                      index
                    )}`}
                  >
                    {space.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Image Carousel */}
        <div className="relative w-full h-[500px] lg:h-[1050px] overflow-hidden min-w-0">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full ml-0">
              {spaces.map((space, _) => (
                <CarouselItem key={space.id} className="h-full pl-0 basis-full">
                  <div className="relative w-full h-full">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

