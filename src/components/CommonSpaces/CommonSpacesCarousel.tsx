import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ui } from "@/i18n/ui";

interface CommonSpace {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface CommonSpacesCarouselProps {
  spaces: CommonSpace[];
  initialActiveIndex?: number;
  lang?: "en" | "pt";
}

export default function CommonSpacesCarousel({
  spaces,
  initialActiveIndex = 0,
  lang = "en",
}: CommonSpacesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [api, setApi] = useState<CarouselApi>();
  const isUserNavigatingRef = useRef(false);
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    []
  );

  // Sync carousel when activeIndex changes (only when user navigates)
  useEffect(() => {
    if (!api) return;
    // Only stop autoplay and scroll if this is user-initiated navigation
    if (isUserNavigatingRef.current) {
      autoplayPlugin.stop();
      api.scrollTo(activeIndex);
      isUserNavigatingRef.current = false;
    }
  }, [api, activeIndex, autoplayPlugin]);

  // Sync activeIndex when carousel is manually navigated
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      // Only update activeIndex if not user navigating (to avoid conflicts)
      if (!isUserNavigatingRef.current) {
        setActiveIndex(selectedIndex);
      }
    };

    // Listen to pointer events to detect button clicks (navigation buttons)
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      // Only stop autoplay if clicking on carousel navigation buttons
      if (
        target.closest('[data-slot="carousel-previous"]') ||
        target.closest('[data-slot="carousel-next"]') ||
        target.closest('button[data-slot]')
      ) {
        autoplayPlugin.stop();
      }
    };

    api.on("select", onSelect);
    
    // Get the carousel container element
    const carouselNode = api.containerNode();
    if (carouselNode) {
      carouselNode.addEventListener("pointerdown", onPointerDown);
    }

    return () => {
      api.off("select", onSelect);
      if (carouselNode) {
        carouselNode.removeEventListener("pointerdown", onPointerDown);
      }
    };
  }, [api, autoplayPlugin]);

  const handleSpaceClick = (index: number) => {
    // Stop autoplay when clicking on space items
    isUserNavigatingRef.current = true;
    autoplayPlugin.stop();
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

  const t = (key: keyof typeof ui.en) => ui[lang][key] || ui.en[key];

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-0">
        {/* Left Column - Text Content */}
        <div className="relative pl-8 md:pl-12 lg:pl-[120px] xl:pl-[195px] pr-8 md:pr-12 lg:pr-16 xl:pr-24 pb-12 md:pb-16 lg:py-16 min-w-0">
          {/* Section Title - Outside border line */}
          <div className="mb-4 md:mb-8 lg:mb-12">
            <div className="font-montserrat text-[#E7C873] uppercase text-[10px] md:text-[14px] lg:text-[18px] tracking-widest md:tracking-[4px] lg:tracking-[6px]">
              {t("common_spaces.title")}
            </div>
          </div>
          
          {/* Content area with border line */}
          <div className="relative">
            {/* Continuous Left Border Line - Static background */}
            <div className="hidden lg:block absolute left-[-89px] top-0 bottom-0 w-1">
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

            <div className="space-y-10 md:space-y-16 lg:space-y-20 xl:space-y-[100px]">
            {spaces.map((space, index) => (
              <div
                key={space.id}
                className="relative cursor-pointer transition-all duration-300 group"
                onClick={() => handleSpaceClick(index)}
              >
                {/* Content */}
                <div>
                  <h3
                    className={`font-playfairDisplay text-[26px] md:text-[36px] lg:text-[48px] xl:text-[56px] leading-tight md:leading-[44px] lg:leading-[56px] xl:leading-[68px] mb-2 md:mb-3 lg:mb-4 transition-colors duration-300 ${getTitleColor(
                      index
                    )}`}
                  >
                    {space.title}
                  </h3>
                  <p
                    className={`font-montserrat text-[11px] md:text-[14px] lg:text-[16px] xl:text-[18px] leading-[140%] max-w-full md:max-w-[85%] lg:max-w-[627px] transition-colors duration-300 ${getDescriptionColor(
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
        </div>

        {/* Right Column - Image Carousel */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] xl:h-full overflow-hidden min-w-0">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin]}
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
