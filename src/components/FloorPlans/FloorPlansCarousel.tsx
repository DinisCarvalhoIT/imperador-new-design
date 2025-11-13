import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextFloorPlans,
  CarouselPreviousFloorPlans,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ui } from "@/i18n/ui";

export type DataCarousel = {
  id: string;
  floorPlanImage: string;
  smallImageCollumnTable: boolean;
  smallImageStyle: string;
  smallFloorPlanImage: string;
  tableImage: string;
  tableImageStyle: string;
  mainTitleKey: string;
  mobileTitleKey: string;
  subTitleKey: string;
};

type FloorPlansCarouselProps = {
  lang: keyof typeof ui;
  dataCarousel: DataCarousel[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
};

// absolute inset-0 ---- no primeiro div itnha
export default function FloorPlansCarousel({
  lang,
  dataCarousel,
  currentIndex,
  onIndexChange,
}: FloorPlansCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(currentIndex ?? 0);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleTitleClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setCurrent(index);
      return;
    }

    setCurrent(index);
    if (onIndexChange) {
      onIndexChange(index);
    }
  };

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
    if (
      api &&
      isInitialized &&
      currentIndex !== undefined &&
      currentIndex !== current
    ) {
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

  const getVisibleTitles = () => {
    const totalSlides = dataCarousel.length;
    const titles = [];

    // Always show 3 titles
    if (current === 0) {
      // At the start: show first 3 slides
      for (let i = 0; i < Math.min(3, totalSlides); i++) {
        titles.push({ ...dataCarousel[i], index: i });
      }
    } else if (current === totalSlides - 1) {
      // At the end: show last 3 slides
      for (let i = Math.max(0, totalSlides - 3); i < totalSlides; i++) {
        titles.push({ ...dataCarousel[i], index: i });
      }
    } else {
      // In the middle: show previous, current, and next
      for (let i = -1; i <= 1; i++) {
        const index = current + i;
        if (index >= 0 && index < totalSlides) {
          titles.push({ ...dataCarousel[index], index });
        }
      }
    }

    return titles;
  };

  const visibleTitles = getVisibleTitles();

  return (
    <div className=" flex flex-col items-center justify-center p-4 md:p-6 lg:p-8  ">
      <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[96%] flex flex-row justify-center items-center md:gap-x-4 gap-x-2">
        {visibleTitles.map((data, idx) => (
          <React.Fragment key={data.index}>
            <div
              className="flex flex-col items-center cursor-pointer"
              role="button"
              tabIndex={0}
              aria-pressed={data.index === current}
              onClick={() => handleTitleClick(data.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleTitleClick(data.index);
                }
              }}
            >
              <div
                className={`lg:text-3xl md:text-2xl text-xl text-white font-playfairDisplay transition-opacity duration-300 ${
                  data.index === current
                    ? "opacity-100 font-normal pb-3"
                    : "opacity-60 pb-3"
                }`}
              >
                <span className="md:hidden font-libreCaslonDisplay">
                  {t(data.mobileTitleKey as keyof (typeof ui)[typeof lang])}
                </span>
                <span className="hidden md:inline">
                  {t(data.mainTitleKey as keyof (typeof ui)[typeof lang])}
                </span>
              </div>
              {data.index === current && (
                <div className="w-full h-[5px] bg-[#F1B44A] rounded-full transition-all duration-300 top-1 relative z-10" />
              )}
            </div>
            {idx < visibleTitles.length - 1 && (
              <div
                className="bg-[#C3871B] mb-5 mx-1 sm:mx-5 md:mx-2 lg:mx-5"
                style={{
                  width: "2px",
                  height: "29.14px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <Carousel
        setApi={setApi}
        className="w-full sm:w-[95%] md:w-[85%] lg:w-[95%] 2xl:w-[86%] h-full md:h-[90%] flex items-center justify-center"
      >
        <CarouselContent className="h-full flex items-center ">
          {dataCarousel.map((data, index) => (
            <CarouselItem
              key={index}
              className="h-full flex items-center justify-center"
            >
              <Card className="w-full max-w-[1250px] h-[940px] sm:h-[1080px] md:h-[1290px] lg:h-[670px] bg-white/86 flex items-center justify-center">
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 h-full w-full items-center justify-items-center p-2 sm:p-4 md:p-6 gap-4 lg:gap-0">
                  <div className="relative flex flex-col items-center justify-center h-full w-full order-1 lg:order-0">
                    <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[350px] xl:max-w-[500px] h-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[577px] flex items-center justify-center">
                      <img
                        src={data.floorPlanImage}
                        alt={data.id}
                        width={546}
                        height={713}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {!data.smallImageCollumnTable && (
                      <img
                        src={data.smallFloorPlanImage}
                        alt={data.id}
                        width={171}
                        height={89}
                        className={data.smallImageStyle}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-6 md:gap-y-7 h-full w-full order-2 lg:order-0">
                    <div className="flex flex-col items-center justify-center gap-y-1">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#E1B260] font-normal font-playfairDisplay text-center">
                        <span className="lg:hidden font-libreCaslonDisplay">
                          {t(
                            data.mobileTitleKey as keyof (typeof ui)[typeof lang]
                          )}
                        </span>
                        <span className="hidden lg:inline">
                          {t(
                            data.mainTitleKey as keyof (typeof ui)[typeof lang]
                          )}
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#024C67] font-playfairDisplay text-center">
                        {t(data.subTitleKey as keyof (typeof ui)[typeof lang])}
                      </p>
                    </div>
                    <div className={data.tableImageStyle}>
                      <img
                        src={data.tableImage}
                        alt={data.id}
                        width={382}
                        height={414}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {data.smallImageCollumnTable && (
                      <img
                        src={data.smallFloorPlanImage}
                        alt={data.id}
                        loading="lazy"
                        width={171}
                        height={89}
                        className={data.smallImageStyle}
                      />
                    )}
                  </div>
                  <div className="flex lg:hidden flex-col items-center justify-center order-3 pt-4">
                    <img
                      src={data.smallFloorPlanImage}
                      alt={data.id}
                      loading="lazy"
                      width={171}
                      height={89}
                      className={" w-[150px] h-[83px] mx-auto"}
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="md:hidden">
          <CarouselPreviousFloorPlans className=" absolute -top-7 left-2 sm:left-15 cursor-pointer" />
          <CarouselNextFloorPlans className="absolute -top-7 right-2 sm:right-15 cursor-pointer" />
        </div>
        <div className="hidden md:block">
          <CarouselPreviousFloorPlans className="cursor-pointer" />
          <CarouselNextFloorPlans className="cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
}
