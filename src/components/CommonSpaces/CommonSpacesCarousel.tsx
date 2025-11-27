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
  images?: string[];
  imageMobile?: string;
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
  const isMobileChangeRef = useRef(false);
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
      }),
    []
  );

  // Sync desktop carousel when activeIndex changes
  useEffect(() => {
    if (!api) return;

    // If change came from mobile, sync desktop carousel
    if (isMobileChangeRef.current) {
      api.scrollTo(activeIndex);
      isMobileChangeRef.current = false;
    }
    // If change came from user navigation on desktop, stop autoplay and scroll
    else if (isUserNavigatingRef.current) {
      autoplayPlugin.stop();
      api.scrollTo(activeIndex);
      isUserNavigatingRef.current = false;
    }
  }, [api, activeIndex, autoplayPlugin]);

  // Sync activeIndex when desktop carousel is manually navigated
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      // Only update activeIndex if not from user navigation or mobile change
      if (!isUserNavigatingRef.current && !isMobileChangeRef.current) {
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
        target.closest("button[data-slot]")
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

  // Sync mobile carousel - when mobile changes, update activeIndex and mark it
  useEffect(() => {
    if (!mobileApi) return;
    const onSelect = () => {
      const selectedIndex = mobileApi.selectedScrollSnap();
      // Mark that this change came from mobile
      isMobileChangeRef.current = true;
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

  const t = (key: keyof (typeof ui)[typeof lang]) =>
    ui[lang][key] || ui.en[key];

  return (
    <div className="relative w-full">
      {/* Mobile/Tablet - Horizontal Card Carousel */}
      <div className="xl:hidden relative w-full overflow-hidden">
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
              <CarouselItem key={space.id} className="pl-0 basis-full shrink-0">
                <div className="relative w-full h-[640px] overflow-hidden">
                  {/* Image(s) */}
                  <div className="absolute inset-0">
                    {space.images && space.images.length > 0 ? (
                      <div className="flex flex-col w-full h-full">
                        <img
                          src={space.imageMobile}
                          alt={`${space.title} `}
                          className="w-full flex-1 object-cover sm:hidden"
                        />
                        {space.images.slice(1).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${space.title} ${idx + 1}`}
                            className="w-full flex-1 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={space.image}
                        alt={space.title}
                        className="w-full h-full object-cover "
                      />
                    )}
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
                  <div className="absolute bottom-0 left-0 right-0 px-[33px] pb-6 sm:px-8 sm:pb-8">
                    {/* Label */}
                    <div className="mb-3 sm:mb-4">
                      <div className="font-montserrat text-[#FBD784] uppercase text-xs sm:text-sm leading-[1.2] tracking-[0.15em]">
                        {t("common_spaces.title")}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-playfairDisplay text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-[1.2] font-normal mb-3 sm:mb-4">
                      {space.title}
                    </h3>

                    {/* Description */}
                    <p className="font-montserrat text-[#B0C4CC] text-sm sm:text-base leading-normal mb-0">
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
            className="absolute bottom-3 hover:text-white hover:bg-[#7192A2] rounded-full  right-4 z-10 w-8 h-8 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="24"
                height="24"
                rx="12"
                stroke="#7192A2"
              />
              <path
                d="M16.0241 12.7295L11.0878 17.8154L10.6504 17.3433L15.1285 12.7295L10.6504 8.11565L11.0878 7.665L16.0241 12.7295Z"
                fill="white"
                stroke="white"
                strokeWidth="0.6"
              />
            </svg>
          </button>
        </Carousel>
      </div>

      {/* Desktop - Original Layout */}
      <div className="hidden xl:grid grid-cols-2 gap-0">
        {/* Left Column - Text Content */}
        <div className="relative pl-[120px] xl:pl-[195px] pr-16 xl:pr-24 py-16 xl:py-20 min-w-0">
          {/* Section Title - Outside border line */}
          <div className="mb-12 xl:mb-16">
            <div className="font-montserrat text-[#E7C873] uppercase text-base xl:text-lg  tracking-[6px] leading-[1.2]">
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

            <div className="space-y-12 xl:space-y-16">
              {spaces.map((space, index) => (
                <div
                  key={space.id}
                  className="relative cursor-pointer transition-all duration-300 group"
                  onClick={() => handleSpaceClick(index)}
                >
                  {/* Content */}
                  <div>
                    <h3
                      className={`font-playfairDisplay text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-[1.2] mb-5 xl:mb-6 transition-colors duration-300 ${getTitleColor(
                        index
                      )}`}
                    >
                      {space.title}
                    </h3>
                    <p
                      className={`font-montserrat text-sm sm:text-base leading-[1.6] max-w-[627px] transition-colors duration-300 ${getDescriptionColor(
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
                <CarouselItem
                  key={space.id}
                  className="h-[960px] pl-0 basis-full flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    {space.images && space.images.length > 0 ? (
                      <div className="flex flex-col w-full h-full">
                        {space.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${space.title} ${idx + 1}`}
                            className="w-full flex-1 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={space.image}
                        alt={space.title}
                        className="w-full h-full  object-cover"
                      />
                    )}
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
