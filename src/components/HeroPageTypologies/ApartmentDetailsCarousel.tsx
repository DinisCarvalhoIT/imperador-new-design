import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextApartmentDetails,
  CarouselPreviousApartmentDetails,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ui } from "@/i18n/ui";
import { Check } from "lucide-react";

export type ApartmentDetail = {
  id: string;
  apartmentImage: string;
  mainTitleKey: string;
  subTitleKey: string;
  features: {
    titleKey: string;
    descriptionKey?: string;
  }[];
};

type ApartmentDetailsCarouselProps = {
  lang: keyof typeof ui;
  dataCarousel: ApartmentDetail[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
};

export default function ApartmentDetailsCarousel({
  lang,
  dataCarousel,
  currentIndex,
  onIndexChange,
}: ApartmentDetailsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(currentIndex ?? 0);
  const [isInitialized, setIsInitialized] = useState(false);

  const t = (key: keyof (typeof ui)[typeof lang]) => {
    return ui[lang][key];
  };

  // Initialize carousel to the correct index when API is ready (only once on mount)
  // Use requestAnimationFrame to ensure carousel is fully ready, and scrollTo with true to jump immediately
  useEffect(() => {
    if (api && !isInitialized && currentIndex !== undefined) {
      requestAnimationFrame(() => {
        if (api) {
          api.scrollTo(currentIndex, true); // true = jump immediately without animation
          setCurrent(currentIndex);
          setIsInitialized(true);
        }
      });
    }
  }, [api, currentIndex, isInitialized]);

  // Sync with external currentIndex changes (after initialization)
  useEffect(() => {
    if (api && isInitialized && currentIndex !== undefined && currentIndex !== current) {
      setCurrent(currentIndex);
      api.scrollTo(currentIndex);
    }
  }, [currentIndex, api, isInitialized, current]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);
      if (onIndexChange) {
        onIndexChange(newIndex);
      }
    });
  }, [api, onIndexChange]);

  const currentData = dataCarousel[current];

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[1400px] h-full flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side - Content */}
        <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-8 text-white px-4 lg:px-8">
          {/* Tagline */}
          <div className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg uppercase text-[#FBD784] tracking-[4px] lg:tracking-[6px]">
            {t("apartment_details.tagline")}
          </div>

          {/* Title */}
          <h1 className="font-playfairDisplay text-3xl sm:text-4xl md:text-5xl lg:text-[58px] leading-tight lg:leading-[68px] text-white">
            {t(currentData.mainTitleKey as keyof (typeof ui)[typeof lang])}
          </h1>

          {/* Subtitle */}
          <p className="font-playfairDisplay text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">
            {t(currentData.subTitleKey as keyof (typeof ui)[typeof lang])}
          </p>

          {/* Features List */}
          <div className="space-y-4 lg:space-y-6">
            {currentData.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 lg:gap-4">
                <Check className="w-5 h-5 lg:w-6 lg:h-6 text-[#FBD784] shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-montserrat text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold">
                    {t(feature.titleKey as keyof (typeof ui)[typeof lang])}
                  </div>
                  {feature.descriptionKey && (
                    <div className="font-montserrat text-sm sm:text-base md:text-lg text-white/80 mt-1">
                      {t(
                        feature.descriptionKey as keyof (typeof ui)[typeof lang]
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Carousel */}
        <div className="flex-1 relative">
          <Carousel
            setApi={setApi}
            className="w-full h-full"
            opts={{
              loop: false,
            }}
          >
            <CarouselContent className="h-full">
              {dataCarousel.map((data, index) => (
                <CarouselItem
                  key={index}
                  className="h-full flex items-center justify-center"
                >
                  <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
                    <img
                      src={data.apartmentImage}
                      alt={t(
                        data.mainTitleKey as keyof (typeof ui)[typeof lang]
                      )}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPreviousApartmentDetails />
            <CarouselNextApartmentDetails />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

