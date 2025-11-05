import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ui } from "@/i18n/ui";
import { ChevronRight } from "lucide-react";

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
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const isUserNavigatingRef = useRef(false);
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
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

  // Sync mobile carousel
  useEffect(() => {
    if (!mobileApi) return;
    const onSelect = () => {
      const selectedIndex = mobileApi.selectedScrollSnap();
      setActiveIndex(selectedIndex);
    };
    mobileApi.on("select", onSelect);
    return () => {
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi]);

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
      {/* Mobile/Tablet - Horizontal Card Carousel */}
      <div className="lg:hidden relative w-full overflow-hidden">
        <Carousel
          setApi={setMobileApi}
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {spaces.map((space, index) => (
              <CarouselItem
                key={space.id}
                className="pl-0 basis-full shrink-0"
              >
                <div className="relative w-full h-[640px] overflow-hidden">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(11, 29, 38, 0) 58.78%, #0F3A4B 82.15%)",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    {/* Label */}
                    <div className="mb-2">
                      <div className="font-montserrat text-[#FBD784] uppercase text-[10px] leading-[12px] tracking-[0.15em]">
                        {t("common_spaces.title")}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-playfairDisplay text-white text-[26px] leading-[68px] font-normal mb-2">
                      {space.title}
                    </h3>

                    {/* Description */}
                    <p className="font-montserrat text-[#B0C4CC] text-[11px] leading-[140%] mb-4 ">
                      {space.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <button
            onClick={() => {
              if (mobileApi) {
                mobileApi.scrollNext();
                autoplayPlugin.stop();
              }
            }}
            className="absolute bottom-4  hover:text-white hover:bg-[#7192A2] rounded-full right-4 z-10 w-4 h-4 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="16" height="16" rx="8" stroke="#7192A2"/>
<path d="M10.8496 8.65295L7.55869 12.0436L7.26709 11.7288L10.2525 8.65295L7.26709 5.57706L7.55869 5.27662L10.8496 8.65295Z" fill="white" stroke="white" stroke-width="0.6"/>
</svg>

          </button>
        </Carousel>
      </div>

      {/* Desktop - Original Layout */}
      <div className="hidden lg:grid grid-cols-2 gap-0">
        {/* Left Column - Text Content */}
        <div className="relative pl-[120px] xl:pl-[195px] pr-16 xl:pr-24 py-16 min-w-0">
          {/* Section Title - Outside border line */}
          <div className="mb-12">
            <div className="font-montserrat text-[#E7C873] uppercase text-[18px] tracking-[6px]">
              {t("common_spaces.title")}
            </div>
          </div>
          
          {/* Content area with border line */}
          <div className="relative">
            {/* Continuous Left Border Line - Static background */}
            <div className="absolute left-[-89px] top-0 bottom-0 w-1">
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

            <div className="space-y-10">
            {spaces.map((space, index) => (
              <div
                key={space.id}
                className="relative cursor-pointer transition-all duration-300 group"
                onClick={() => handleSpaceClick(index)}
              >
                {/* Content */}
                <div>
                  <h3
                    className={`font-playfairDisplay text-[48px] xl:text-[56px] leading-[56px] xl:leading-[68px] mb-4 transition-colors duration-300 ${getTitleColor(
                      index
                    )}`}
                  >
                    {space.title}
                  </h3>
                  <p
                    className={`font-montserrat text-[16px] xl:text-[18px] leading-[140%] max-w-[627px] transition-colors duration-300 ${getDescriptionColor(
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
        <div className="relative w-full h-full overflow-hidden min-w-0 flex items-center justify-center">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin]}
            className="w-full h-full flex items-center"
          >
            <CarouselContent className="h-full ml-0 flex items-center">
              {spaces.map((space, _) => (
                <CarouselItem key={space.id} className="max-h-[960px] pl-0 basis-full flex items-center justify-center h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full  object-cover"
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
