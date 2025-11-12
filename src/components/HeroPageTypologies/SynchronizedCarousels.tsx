import React, { useState, useEffect } from "react";
import ApartmentDetailsCarousel from "./ApartmentDetailsCarousel";
import FloorPlansCarousel from "@/components/FloorPlans/FloorPlansCarousel";
import type { ApartmentDetail } from "./ApartmentDetailsCarousel";
import { ui } from "@/i18n/ui";
import {
  getModelIndexFromUrl,
  getModelStringFromIndex,
} from "@/data/apartmentModels";

export type FloorPlanItem = {
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

type SynchronizedCarouselsProps = {
  lang: keyof typeof ui;
  apartmentDetailsData: ApartmentDetail[];
  floorPlansData: FloorPlanItem[];
  initialIndex?: number;
};

export default function SynchronizedCarousels({
  lang,
  apartmentDetailsData,
  floorPlansData,
  initialIndex,
}: SynchronizedCarouselsProps) {
  // Initialize from initialIndex prop (which comes from Astro's URL search params)
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);

  // On mount, also check URL in case it changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlIndex = getModelIndexFromUrl(searchParams);
      if (urlIndex !== currentIndex) {
        setCurrentIndex(urlIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update URL when index changes
  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);

    if (typeof window !== "undefined") {
      const modelString = getModelStringFromIndex(newIndex);
      const url = new URL(window.location.href);
      url.searchParams.set("model", modelString);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const newIndex = getModelIndexFromUrl(searchParams);
      setCurrentIndex(newIndex);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="w-full pt-6 md:pt-20">
      {/* Apartment Details Section */}
      <section className="w-full min-h-screen flex items-center justify-center relative bg-[#0B1D26]">
        <div className="absolute inset-0 w-full h-full -z-10 opacity-30">
          <img
            src="/detailsApartments/details-apartments.png"
            alt="Apartment Details Background"
            className="w-full h-full object-cover"
          />
        </div>
        <ApartmentDetailsCarousel
          lang={lang}
          dataCarousel={apartmentDetailsData}
          currentIndex={currentIndex}
          onIndexChange={handleIndexChange}
        />
      </section>

      {/* Floor Plans Section */}
      <section className="w-full min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 w-full h-full -z-10">
          <img
            src="/FloorPlans/Rectangle 34624212.png"
            alt="Floor Plans"
            className="w-full h-full object-cover"
          />
        </div>
        <FloorPlansCarousel
          lang={lang}
          dataCarousel={floorPlansData}
          currentIndex={currentIndex}
          onIndexChange={handleIndexChange}
        />
      </section>
    </div>
  );
}
