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
  checkIconUrl?: string;
};

export default function ApartmentDetailsCarousel({
  lang,
  dataCarousel,
  currentIndex,
  onIndexChange,
  checkIconUrl = "/Check.svg",
}: ApartmentDetailsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(currentIndex ?? 0);
  const [isInitialized, setIsInitialized] = useState(false);

  const t = (key: keyof (typeof ui)[typeof lang]) => {
    return ui[lang][key];
  };

  // Format subtitle text similar to InteractiveBuilding
  // Example: "1 Unidade - Piso Térreo" or "7 Unidades - Piso 1 a 7"
  function formatSubtitleForRender(subtitleText: string): {
    unitsNumber?: string;
    unitsWord?: string;
    floorsParts: Array<{ text: string; isNumber: boolean }>;
  } {
    const parts = subtitleText.split(" - ");
    if (parts.length !== 2) {
      // Fallback: just parse the whole text
      return {
        floorsParts: parseTextWithNumbers(subtitleText),
      };
    }

    const unitsPart = parts[0]; // "1 Unidade" or "7 Unidades"
    const floorsPart = parts[1]; // "Piso Térreo" or "Piso 1 a 7"

    // Parse units part
    const unitsMatch = unitsPart.match(/^(\d+)\s+(.+)$/);
    const unitsNumber = unitsMatch ? unitsMatch[1] : "";
    const unitsWord = unitsMatch ? unitsMatch[2] : unitsPart;

    // Parse floors part
    const floorsParsed = parseTextWithNumbers(floorsPart);

    return {
      unitsNumber,
      unitsWord,
      floorsParts: floorsParsed,
    };
  }

  // Parse text and identify numbers vs text
  function parseTextWithNumbers(text: string) {
    const parts: Array<{ text: string; isNumber: boolean }> = [];
    const words = text.split(/\s+/);

    words.forEach((word) => {
      // Check if word is a number
      if (!isNaN(Number(word))) {
        parts.push({ text: word, isNumber: true });
      } else {
        parts.push({ text: word, isNumber: false });
      }
    });

    return parts;
  }

  // Parse title text to identify numbers, "&" symbols, and split "& Storage/Arrecadação" to new line
  function parseTitleForRender(
    titleText: string
  ): Array<{
    text: string;
    isNumber: boolean;
    isAmpersand: boolean;
    isNewLine: boolean;
  }> {
    const parts: Array<{
      text: string;
      isNumber: boolean;
      isAmpersand: boolean;
      isNewLine: boolean;
    }> = [];

    // Check if title contains "& Storage" or "& Arrecadação" at the end
    // Pattern matches: anything before, then "&" followed by "Storage" or "Arrecadação"
    const ampStorageMatch = titleText.match(
      /^(.+?)\s+&\s+(Storage|Arrecadação)$/i
    );

    if (ampStorageMatch) {
      // First part (before "& Storage/Arrecadação")
      const firstPart = ampStorageMatch[1];
      const words = firstPart.split(/\s+/);

      words.forEach((word) => {
        if (!isNaN(Number(word))) {
          parts.push({
            text: word,
            isNumber: true,
            isAmpersand: false,
            isNewLine: false,
          });
        } else {
          parts.push({
            text: word,
            isNumber: false,
            isAmpersand: false,
            isNewLine: false,
          });
        }
      });

      // Add "& Storage/Arrecadação" on new line
      const storageWord = ampStorageMatch[2];
      // Add "&" on new line
      parts.push({
        text: "&",
        isNumber: false,
        isAmpersand: true,
        isNewLine: true,
      });
      // Add "Storage" or "Arrecadação" after "&"
      parts.push({
        text: storageWord,
        isNumber: false,
        isAmpersand: false,
        isNewLine: false,
      });
    } else {
      // No "& Storage/Arrecadação" pattern, parse normally
      const words = titleText.split(/\s+/);

      words.forEach((word) => {
        const isAmp = word === "&";
        const isNumber = !isNaN(Number(word));
        parts.push({
          text: word,
          isNumber: isNumber,
          isAmpersand: isAmp,
          isNewLine: false,
        });
      });
    }

    return parts;
  }

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

  const currentData = dataCarousel[current];

  return (
    <div className="w-full h-full flex items-center justify-center p-5 md:p-6 lg:p-8 relative">
      {/* Background Rectangle - Behind everything, 1/3 height */}

      <div className="w-full max-w-[1400px] h-full flex flex-col lg:flex-row gap-8 lg:gap-12 relative ">
        {/* Mobile: Just a line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-8 z-0 lg:hidden rounded-2xl"
          style={{
            width: "157px",
            height: "0px",
            border: "0.8px solid #7192A2",
          }}
        />
        {/* Desktop: Full rectangle with gradient */}
        <div
          className="hidden lg:block absolute left-0 right-0 -top-8 z-0"
          style={{
            height: "33.333%",
            background:
              "linear-gradient(359.44deg, rgba(11, 29, 38, 0) 0.43%, #092635 99.46%)",
            borderTop: "0.8px solid #7192A2",
          }}
        />

        {/* Left Side - Content */}
        <div className="flex-1 flex z-1 flex-col justify-center space-y-6 lg:space-y-8 text-white px-4 lg:px-8">
          {/* Tagline */}
          <div className="font-montserrat text-[10px] sm:text-xs md:text-sm lg:text-base uppercase text-[#FBD784] tracking-[3px] lg:tracking-[5px]">
            {t("apartment_details.tagline")}
          </div>

          {/* Title */}
          <h1 className="font-playfairDisplay text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-tight lg:leading-[52px] text-white font-normal mb-2 lg:mb-3">
            {(() => {
              // Render mainTitleKey, replacing numbers and '-' with specific styles and spacing
              const mainTitle = t(currentData.mainTitleKey as keyof (typeof ui)[typeof lang]);
              // Split on '-' with optional whitespace around, capturing the separators
              const parts = mainTitle.split(/(\s*-\s*)/);
              return parts.map((part, idx) => {
                const isDash = part.match(/^\s*-\s*$/);
                if (isDash) {
                  return (
                    <span
                      key={idx}
                      className="font-playpenSans text-[16px] lg:text-[36px] mx-2"
                      style={{ verticalAlign: "middle" }}
                    >
                      -
                    </span>
                  );
                }
                // In each non-dash part, find numbers to wrap them with Libre Caslon Display
                const numberRe = /\d+/g;
                const subParts: React.ReactNode[] = [];
                let lastIndex = 0;
                let m: RegExpExecArray | null;
                while ((m = numberRe.exec(part)) !== null) {
                  const before = part.slice(lastIndex, m.index);
                  if (before) subParts.push(<span key={idx + '-before-' + m.index}>{before}</span>);
                  subParts.push(
                    <span
                      key={idx + '-num-' + m.index}
                      className="font-libreCaslonDisplay"
                    >
                      {m[0]}
                    </span>
                  );
                  lastIndex = m.index + m[0].length;
                }
                const after = part.slice(lastIndex);
                if (after) subParts.push(<span key={idx + '-after'}>{after}</span>);
                return <React.Fragment key={idx}>{subParts}</React.Fragment>;
              });
            })()}
          </h1>

          {/* Subtitle */}
          <p className="text-[#B0C4CC] leading-[24px] md:leading-[40px] text-[15px] md:text-[32px]">
            {(() => {
              const subtitleText = t(
                currentData.subTitleKey as keyof (typeof ui)[typeof lang]
              );
              const formatted = formatSubtitleForRender(subtitleText);

              return (
                <>
                  {formatted.unitsNumber &&
                    formatted.unitsNumber.length > 0 && (
                      <>
                        <span className="font-libreCaslonDisplay leading-[24px] md:leading-[40px] text-[15px] md:text-[32px]">
                          {formatted.unitsNumber}{" "}
                        </span>
                        {formatted.unitsWord && (
                          <span className="font-playfairDisplay leading-[24px] md:leading-[40px] text-[15px] md:text-[32px]">
                            {formatted.unitsWord}{" "}
                          </span>
                        )}
                        <span className="font-playpenSans text-[15px] md:text-[24px] leading-[24px] md:leading-[40px]">
                          -{" "}
                        </span>
                      </>
                    )}
                  {formatted.floorsParts.map((part, i, arr) => (
                    <span
                      key={i}
                      className={`${
                        part.isNumber
                          ? "font-libreCaslonDisplay"
                          : "font-playfairDisplay"
                      } leading-[24px] md:leading-[40px] text-[15px] md:text-[32px]`}
                    >
                      {part.text}
                      {i < arr.length - 1 ? " " : ""}
                    </span>
                  ))}
                </>
              );
            })()}
          </p>

          {/* Features List */}
          <div className="space-y-4 lg:space-y-6">
            {currentData.features.map((feature, index) => (
              <div key={index} className="flex gap-3 lg:gap-4">
                <img
                  src={checkIconUrl}
                  alt="Check"
                  className="w-5 h-5 lg:w-6 lg:h-[20px] shrink-0 self-start mt-3.5"
                  width={24}
                  height={20}
                />
                <div className="flex-1">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-[24px] leading-[140%] text-white font-normal">
                    {(() => {
                      const titleText = t(
                        feature.titleKey as keyof (typeof ui)[typeof lang]
                      );
                      const parsed = parseTitleForRender(titleText);

                      return (
                        <>
                          {parsed.map((part, i, arr) => {
                            // Determine font based on part type
                            const fontClass =
                              part.isNumber || part.isAmpersand
                                ? "font-libreCaslonDisplay"
                                : "font-playfairDisplay";

                            // Add line break before "& Storage/Arrecadação"
                            const shouldBreak = part.isNewLine;
                            const nextPart = arr[i + 1];
                            // Add space after current part if:
                            // - Not breaking line
                            // - Not the last part
                            // - Next part is not starting a new line
                            const needsSpace =
                              !shouldBreak &&
                              i < arr.length - 1 &&
                              !nextPart?.isNewLine;

                            return (
                              <React.Fragment key={i}>
                                {shouldBreak && <br />}
                                <span className={fontClass}>{part.text} </span>
                              </React.Fragment>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                  {feature.descriptionKey && (
                    <div className="font-montserrat text-pretty text-sm sm:text-base md:text-lg lg:text-[15px] leading-[140%] text-[#B0C4CC] font-normal mt-1">
                      {(() => {
                        const descriptionText = t(
                          feature.descriptionKey as keyof (typeof ui)[typeof lang]
                        );
                        // If Portuguese and contains "Legrand Living Now", make it italic
                        if (lang === "pt" && descriptionText.includes("Legrand Living Now")) {
                          const parts = descriptionText.split("Legrand Living Now");
                          return (
                            <>
                              {parts[0]}
                              <span className="italic">Legrand Living Now</span>
                              {parts[1]}
                            </>
                          );
                        }
                        return descriptionText;
                      })()}
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
                  className="h-full flex items-end justify-end"
                >
                  <div className="relative w-full h-full min-h-[272px] pb-5 md:pb-0 md:min-h-[500px] lg:min-h-[600px] flex items-end justify-end">
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
