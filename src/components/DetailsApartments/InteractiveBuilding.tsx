import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet-apartments";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { useTranslations } from "@/i18n/utils";
import type { ui } from "@/i18n/ui";

type ApartmentType = "T1" | "T2" | "T3";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ApartmentModel = {
  suites: number;
  bathrooms: number;
  parking: number;
  area: number;
  unitsCount: number;
  isSingleUnit: boolean;
  isGroundFloor: boolean;
  floorRange?: { from: number; to: number };
};

type ApartmentItem = {
  type: ApartmentType;
  modelIndex: number;
  model: ApartmentModel;
};

const APARTMENT_DATA: Record<ApartmentType, ApartmentModel[]> = {
  T1: [
    {
      suites: 1,
      bathrooms: 2,
      parking: 2,
      area: 176,
      unitsCount: 1,
      isSingleUnit: true,
      isGroundFloor: true,
    },
    {
      suites: 1,
      bathrooms: 2,
      parking: 2,
      area: 132,
      unitsCount: 7,
      isSingleUnit: false,
      isGroundFloor: false,
      floorRange: { from: 1, to: 7 },
    },
    {
      suites: 1,
      bathrooms: 2,
      parking: 2,
      area: 132,
      unitsCount: 7,
      isSingleUnit: false,
      isGroundFloor: false,
      floorRange: { from: 1, to: 7 },
    },
  ],
  T2: [
    {
      suites: 2,
      bathrooms: 3,
      parking: 2,
      area: 185,
      unitsCount: 7,
      isSingleUnit: false,
      isGroundFloor: false,
      floorRange: { from: 1, to: 7 },
    },
    {
      suites: 2,
      bathrooms: 3,
      parking: 2,
      area: 185,
      unitsCount: 7,
      isSingleUnit: false,
      isGroundFloor: false,
      floorRange: { from: 1, to: 7 },
    },
  ],
  T3: [
    {
      suites: 3,
      bathrooms: 4,
      parking: 3,
      area: 311,
      unitsCount: 1,
      isSingleUnit: true,
      isGroundFloor: true,
    },
    {
      suites: 3,
      bathrooms: 4,
      parking: 3,
      area: 307,
      unitsCount: 1,
      isSingleUnit: true,
      isGroundFloor: true,
    },
  ],
};

// Create a flat array of all apartment models across all types
function getAllApartmentItems(): ApartmentItem[] {
  const items: ApartmentItem[] = [];
  const types: ApartmentType[] = ["T1", "T2", "T3"];

  types.forEach((type) => {
    APARTMENT_DATA[type].forEach((model, index) => {
      items.push({ type, modelIndex: index, model });
    });
  });

  return items;
}

const ALL_APARTMENTS = getAllApartmentItems();

// Find the index in ALL_APARTMENTS for a given type and shapeIndex
function findApartmentIndex(type: ApartmentType, shapeIndex: number): number {
  let index = 0;
  for (const item of ALL_APARTMENTS) {
    if (item.type === type && item.modelIndex === shapeIndex) {
      return index;
    }
    index++;
  }
  return 0;
}
const BASE_SHAPES_MOBILE: Record<ApartmentType, Rect[]> = {
  // Mobile coordinates approximated for the mobile image composition (1000x1000 space)
  T1: [
    { x: 336, y: 597, width: 330, height: 28 },
    { x: 256, y: 352, width: 244, height: 245 },
    { x: 500, y: 352, width: 244, height: 245 },
  ],
  T2: [
    { x: 54, y: 352, width: 201, height: 245 },
    { x: 745, y: 352, width: 206, height: 245 },
  ],
  T3: [
    { x: 54, y: 597, width: 282, height: 28 },
    { x: 666, y: 597, width: 286, height: 28 },
  ],
};
const BASE_SHAPES: Record<ApartmentType, Rect[]> = {
  // Coordinates in a 1000x1000 viewBox space so the SVG scales with the image
  T1: [
    { x: 419, y: 758, width: 239, height: 78 }, // T1 model a
    { x: 360, y: 198, width: 184, height: 560 }, // T1 model b
    { x: 544, y: 198, width: 179, height: 560 }, // T1 model c
  ],
  T2: [
    { x: 220, y: 198, width: 140, height: 560 }, // T2 model a
    { x: 723, y: 198, width: 140, height: 560 }, // T2 model b
  ],
  T3: [
    { x: 220, y: 758, width: 199, height: 78 }, // T3 model a
    { x: 658, y: 758, width: 205, height: 78 }, // T3 model b
  ],
};


const GOLD = "#F1B44A";

interface InteractiveBuildingProps {
  imageWidth?: number;
  imageHeight?: number;
  lang?: keyof typeof ui;
}

type HoverState = {
  type: ApartmentType;
  shapeIndex: number | null; // null = all shapes of this type, number = specific shape
};

type SelectedState = {
  type: ApartmentType;
  shapeIndex: number;
};

export default function InteractiveBuilding({
  imageWidth: initialWidth = 1920,
  imageHeight: initialHeight = 1080,
  lang = "en",
}: InteractiveBuildingProps) {
  const t = useTranslations(lang);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const VIEW_W = 1000;
  const VIEW_H = 1000;
  const [hovered, setHovered] = React.useState<HoverState | null>(null);
  const [selected, setSelected] = React.useState<SelectedState | null>(null);
  const [open, setOpen] = React.useState(false);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const isCarouselControlled = React.useRef(false);
  const lastOpenAtRef = React.useRef<number>(0);
  const [enableDefaultMobileHighlight, setEnableDefaultMobileHighlight] = React.useState(true);



  function openFor(type: ApartmentType, shapeIndex: number) {
    const now = Date.now();
    // Guard against duplicate pointer/click events on some mobile browsers
    if (now - lastOpenAtRef.current < 350) return;
    lastOpenAtRef.current = now;

    setSelected((prev) => {
      if (prev && prev.type === type && prev.shapeIndex === shapeIndex) {
        return prev; // no state churn if unchanged
      }
      return { type, shapeIndex };
    });
    setOpen((wasOpen) => (wasOpen ? wasOpen : true));
  }

  const baseActive: HoverState | null =
    hovered ?? (selected ? { type: selected.type, shapeIndex: selected.shapeIndex } : null);
  const activeMobile: HoverState | null =
    baseActive ?? (enableDefaultMobileHighlight ? { type: "T1", shapeIndex: null } : null);
  const activeDesktop: HoverState | null = baseActive;
  const interactingMobile = Boolean(activeMobile);
  const interactingDesktop = Boolean(activeDesktop);
  

  const SHAPES_MOBILE = BASE_SHAPES_MOBILE;
  const SHAPES_DESKTOP = BASE_SHAPES;

  // Get model letter from shape index (0 = a, 1 = b, 2 = c)
  function getModelLetter(shapeIndex: number): string {
    return String.fromCharCode(97 + shapeIndex); // 'a', 'b', 'c'
  }

  // Format units text for rendering with original font styling
  function formatUnitsForRender(model: ApartmentModel) {
    const unitsText = model.isSingleUnit 
      ? `${model.unitsCount} ${t("details_apartments.unit")}` 
      : `${model.unitsCount} ${t("details_apartments.units")}`;
    const parts = unitsText.split(" ");
    return { number: parts[0], word: parts.slice(1).join(" ") };
  }

  // Format floors text for rendering with original font styling
  function formatFloorsForRender(model: ApartmentModel) {
    if (model.isGroundFloor) {
      const floorsText = t("details_apartments.ground_floor");
      const parts = floorsText.split(" ");
      return parts.map((part, i) => ({ text: part, isNumber: !isNaN(Number(part)) }));
    }
    if (model.floorRange) {
      const floorsText = t("details_apartments.floor_range")
        .replace("{from}", model.floorRange.from.toString())
        .replace("{to}", model.floorRange.to.toString());
      const parts = floorsText.split(" ");
      return parts.map((part, i) => ({ text: part, isNumber: !isNaN(Number(part)) }));
    }
    return [];
  }

  // Sync carousel with selected model when sheet opens or selected changes from outside
  React.useEffect(() => {
    if (!api || !selected || !open || isCarouselControlled.current) {
      isCarouselControlled.current = false;
      return;
    }
    const carouselIndex = findApartmentIndex(
      selected.type,
      selected.shapeIndex
    );
    api.scrollTo(carouselIndex);
  }, [api, selected?.type, selected?.shapeIndex, open]);

  // Track carousel current index and update selected area when carousel changes
  React.useEffect(() => {
    if (!api || !selected) return;

    const updateSelected = () => {
      isCarouselControlled.current = true;
      const carouselIndex = api.selectedScrollSnap();
      setCurrent(carouselIndex);

      // Get the apartment item at this carousel index
      const apartmentItem = ALL_APARTMENTS[carouselIndex];
      if (apartmentItem) {
        // Update selected to highlight the corresponding area on the map
        setSelected((prev) => {
          if (!prev) return prev;
          // Only update if the type or index actually changed
          if (
            prev.type !== apartmentItem.type ||
            prev.shapeIndex !== apartmentItem.modelIndex
          ) {
            return {
              type: apartmentItem.type,
              shapeIndex: apartmentItem.modelIndex,
            };
          }
          return prev;
        });
      }
    };

    // Set initial current index
    const initialIndex = findApartmentIndex(selected.type, selected.shapeIndex);
    setCurrent(initialIndex);

    api.on("select", updateSelected);

    return () => {
      api.off("select", updateSelected);
    };
  }, [api, selected?.type, selected?.shapeIndex]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Gradient overlays - solid bands that don't affect apartment shapes */}
      {/* Left gradient band */}
      <div className="hidden lg:block pointer-events-none absolute left-0 top-0 bottom-0 w-1/5 bg-linear-to-r from-[#0F3A4B] to-transparent z-5" />
      {/* Top/Bottom gradients with mask that excludes active shapes - Mobile */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-5 lg:hidden"
        aria-hidden
      >
        <defs>
          <linearGradient id="gradTopMobile" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0F3A4B" />
            <stop offset="1%" stopColor="#0F3A4B" />
            <stop offset="100%" stopColor="#0F3A4B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradBottomMobile" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0B1D26" stopOpacity="0" />
            <stop offset="100%" stopColor="#06384A" />
          </linearGradient>

          <mask id="activeHoleMaskMobile" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="white" />
            {activeMobile &&
              (activeMobile.shapeIndex === null
                ? SHAPES_MOBILE[activeMobile.type].map((r, i) => (
                    <rect key={`maskM-${activeMobile.type}-${i}`} x={r.x} y={r.y} width={r.width} height={r.height} fill="black" />
                  ))
                : (() => {
                    const r = SHAPES_MOBILE[activeMobile.type][activeMobile.shapeIndex];
                    return (
                      <rect key={`maskM-${activeMobile.type}-${activeMobile.shapeIndex}`} x={r.x} y={r.y} width={r.width} height={r.height} fill="black" />
                    );
                  })())}
          </mask>
        </defs>

        {(() => {
          const topHeight = interactingMobile ? VIEW_H * 0.5 : VIEW_H * 0.26;
          const bottomHeight = interactingMobile ? VIEW_H * 0.5 : VIEW_H * 0.19;
          return (
            <g mask="url(#activeHoleMaskMobile)">
              <rect x={0} y={0} width={VIEW_W} height={topHeight} fill="url(#gradTopMobile)" style={{ transition: "height 300ms ease-out" }} />
              <rect x={0} y={VIEW_H - bottomHeight} width={VIEW_W} height={bottomHeight} fill="url(#gradBottomMobile)" style={{ transition: "height 300ms ease-out, y 300ms ease-out" }} />
            </g>
          );
        })()}
      </svg>

      {/* Top/Bottom gradients with mask that excludes active shapes - Desktop */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-5 hidden lg:block"
        aria-hidden
      >
        <defs>
          <linearGradient id="gradTopDesktop" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0F3A4B" />
            <stop offset="1%" stopColor="#0F3A4B" />
            <stop offset="100%" stopColor="#0F3A4B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradBottomDesktop" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0B1D26" stopOpacity="0" />
            <stop offset="100%" stopColor="#06384A" />
          </linearGradient>

          <mask id="activeHoleMaskDesktop" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="white" />
            {activeDesktop &&
              (activeDesktop.shapeIndex === null
                ? SHAPES_DESKTOP[activeDesktop.type].map((r, i) => (
                    <rect key={`maskD-${activeDesktop.type}-${i}`} x={r.x} y={r.y} width={r.width} height={r.height} fill="black" />
                  ))
                : (() => {
                    const r = SHAPES_DESKTOP[activeDesktop.type][activeDesktop.shapeIndex];
                    return (
                      <rect key={`maskD-${activeDesktop.type}-${activeDesktop.shapeIndex}`} x={r.x} y={r.y} width={r.width} height={r.height} fill="black" />
                    );
                  })())}
          </mask>
        </defs>

        {(() => {
          const topHeight = interactingDesktop ? VIEW_H * 0.5 : VIEW_H * 0.26;
          const bottomHeight = interactingDesktop ? VIEW_H * 0.5 : VIEW_H * 0.19;
          return (
            <g mask="url(#activeHoleMaskDesktop)">
              <rect x={0} y={0} width={VIEW_W} height={topHeight} fill="url(#gradTopDesktop)" style={{ transition: "height 300ms ease-out" }} />
              <rect x={0} y={VIEW_H - bottomHeight} width={VIEW_W} height={bottomHeight} fill="url(#gradBottomDesktop)" style={{ transition: "height 300ms ease-out, y 300ms ease-out" }} />
            </g>
          );
        })()}
      </svg>

      {/* Left selector: T1 / T2 / T3 */}
      <div className="hidden lg:flex absolute left-0 top-0 bottom-0 pl-6 md:pl-12 lg:pl-24 xl:pl-32 items-center z-15">
        <div className="flex flex-col justify-center gap-[48px] w-24 text-white">
          {/* T1 */}
          <button
            type="button"
            aria-label="T1"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
            onMouseEnter={() => setHovered({ type: "T1", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T1", 0)}
          >
            <svg
              width="91"
              height="57"
              viewBox="0 0 91 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-15 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 1.23204L0.0172992 17.8369L0 18.0487H1.5353L1.5526 17.8671C2.49108 6.72232 5.73901 2.77105 13.9604 2.77105H19.8595V55.3739H14.0037V56.9129H32.3754V55.3739H26.7619L26.6797 2.77105H32.6609C40.8218 2.77105 44.0481 6.72231 44.9866 17.8715L45.0039 18.053H46.5392L45.3715 1.23204H1.1677Z"
                className={
                  activeDesktop?.type === "T1"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M77.1026 55.374V0L76.7652 0.306937C68.7168 7.708 61.3863 10.4834 57.7361 11.4777L57.5372 11.5339L57.9826 12.9778L58.1729 12.9216C62.5323 11.6247 66.9912 9.54962 70.1959 7.34054V55.3696H56.4517V56.9086H90.7646V55.3696H77.1026V55.374Z"
                className={
                  activeDesktop?.type === "T1"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`mt-[23px] h-[3px] w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeDesktop?.type === "T1"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>
          <img
            src="/detailsApartments/dot.svg"
            alt="Separator dot"
            className="h-2 w-auto self-center"
          />
          {/* T2 */}
          <button
            type="button"
            aria-label="T2"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            onMouseEnter={() => setHovered({ type: "T2", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T2", 0)}
          >
            <svg
              width="93"
              height="57"
              viewBox="0 0 93 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-15 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 0.566345L0.0172992 17.1755L0 17.3873H1.53963L1.55693 17.2058C2.49108 6.05661 5.73901 2.10535 13.9648 2.10535H19.8638V54.7082H14.008V56.2472H32.3798V54.7082H26.7662L26.684 2.10535H32.6652C40.8304 2.10535 44.0524 6.05661 44.9909 17.2058L45.0082 17.3873H46.5435L45.3758 0.566345H1.1677Z"
                className={
                  activeDesktop?.type === "T2"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M90.8296 44.3026L88.8791 49.7496H62.7746C79.8922 36.6076 88.572 24.5333 88.572 13.8554C88.572 5.17901 82.2362 0 71.6188 0C62.567 0 55.4787 6.48025 55.4787 14.7502C55.4787 18.1352 57.0442 20.1541 59.6651 20.1541C62.2859 20.1541 63.4449 18.1136 63.4449 16.2158C63.4449 14.8151 63.2374 13.7127 63.0341 12.6406C62.8352 11.5901 62.6319 10.505 62.6319 9.14325C62.6319 5.35626 65.3868 1.539 71.541 1.539C78.1017 1.539 81.4275 5.68481 81.4275 13.8597C81.4275 25.3028 73.366 38.674 58.7266 51.5091L57.8962 52.2224C56.4431 53.4718 54.2504 55.3653 53.5325 55.8884L53.0352 56.2515H88.3558L92.4773 44.3069H90.8339L90.8296 44.3026Z"
                className={
                  activeDesktop?.type === "T2"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`mt-[23px] h-[3px] w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeDesktop?.type === "T2"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>
          <img
            src="/detailsApartments/dot.svg"
            alt="Separator dot"
            className="h-2 w-auto self-center"
          />
          {/* T3 */}
          <button
            type="button"
            aria-label="T3"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            onMouseEnter={() => setHovered({ type: "T3", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T3", 0)}
          >
            <svg
              width="93"
              height="57"
              viewBox="0 0 93 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-15 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 0.566284L0.0172992 17.1755L0 17.3873H1.53963L1.55693 17.2057C2.49108 6.05655 5.73901 2.10529 13.9648 2.10529H19.8638V54.7082H14.008V56.2472H32.3798V54.7082H26.7662L26.684 2.10529H32.6652C40.8304 2.10529 44.0524 6.05655 44.9909 17.2057L45.0082 17.3873H46.5435L45.3758 0.566284H1.1677Z"
                className={
                  activeDesktop?.type === "T3"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M76.938 23.954C83.1874 21.572 87.1878 16.6827 87.1878 11.3351C87.1878 4.2366 81.7602 0 72.6738 0C64.3572 0 58.3241 5.52056 58.3241 13.1248C58.3241 16.4017 59.8205 18.2822 62.4283 18.2822C65.2178 18.2822 66.2082 16.2936 66.2082 14.586C66.2082 13.1161 65.9401 11.9532 65.6806 10.8292C65.4514 9.83493 65.2308 8.89684 65.2308 7.83769C65.2308 3.95127 68.0852 1.53468 72.6738 1.53468C77.7684 1.53468 80.6876 5.07527 80.6876 11.2529C80.6876 16.6524 77.6127 21.745 73.2014 23.6514C68.9977 23.6601 65.3173 24.6976 65.3173 25.8821C65.3173 26.1242 65.4341 26.3317 65.6546 26.483C66.9002 27.339 71.718 26.3749 74.4037 25.3547C80.9341 26.5262 84.6751 31.8436 84.6751 39.945C84.6751 51.1114 78.123 55.1362 72.5138 55.1924C66.6839 55.1924 63.8512 52.9185 63.8512 48.2366C63.8512 47.1645 64.0544 46.2221 64.2664 45.2278C64.4999 44.1254 64.7464 42.9884 64.7464 41.5705C64.7464 39.7548 63.7777 37.6321 61.0487 37.6321C58.3198 37.6321 56.8623 39.6208 56.8623 42.9538C56.8623 51.2411 63.1506 56.8092 72.5138 56.8092C81.8769 56.8092 92.0705 51.4789 92.0705 39.7807C92.0705 31.7701 86.2969 25.7524 76.9423 23.9454L76.938 23.954Z"
                className={
                  activeDesktop?.type === "T3"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`mt-[23px] h-[3px] w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeDesktop?.type === "T3"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile selector: T1 · T2 · T3 with halo background */}
      <div className="flex lg:hidden absolute left-0 right-0 top-36 items-center justify-center z-15">
        <div className="relative flex items-center gap-4 text-white">
          {/* Radial halo behind */}
          <svg
            width="427"
            height="131"
            viewBox="0 0 427 131"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            aria-hidden
          >
            <defs>
              <radialGradient id="paint0_radial_222_2446" cx="0" cy="0" r="1" gradientTransform="matrix(0.132697 46.0404 -150.345 0.383621 213.061 65.2488)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08394B" />
                <stop offset="1" stopColor="#122634" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="213.061" cy="65.2488" rx="213.062" ry="65.2461" transform="rotate(0.165136 213.061 65.2488)" fill="url(#paint0_radial_222_2446)" fillOpacity="0.4" />
          </svg>

          {/* T1 */}
          <button
            type="button"
            aria-label="T1"
            className="group relative hover:cursor-pointer flex flex-col items-center w-fit transform-gpu transition-all duration-500 ease-out"
            onMouseEnter={() => setHovered({ type: "T1", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T1", 0)}
          >
            <svg
              width="56"
              height="34"
              viewBox="0 0 91 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 1.23204L0.0172992 17.8369L0 18.0487H1.5353L1.5526 17.8671C2.49108 6.72232 5.73901 2.77105 13.9604 2.77105H19.8595V55.3739H14.0037V56.9129H32.3754V55.3739H26.7619L26.6797 2.77105H32.6609C40.8218 2.77105 44.0481 6.72231 44.9866 17.8715L45.0039 18.053H46.5392L45.3715 1.23204H1.1677Z"
                className={
                  activeMobile?.type === "T1"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M77.1026 55.374V0L76.7652 0.306937C68.7168 7.708 61.3863 10.4834 57.7361 11.4777L57.5372 11.5339L57.9826 12.9778L58.1729 12.9216C62.5323 11.6247 66.9912 9.54962 70.1959 7.34054V55.3696H56.4517V56.9086H90.7646V55.3696H77.1026V55.374Z"
                className={
                  activeMobile?.type === "T1"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-[15px] h-[2px] w-[52px] bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeMobile?.type === "T1"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>

          <img src="/detailsApartments/dot.svg" alt="Separator dot" className="h-1.5 w-auto self-center" />

          {/* T2 */}
          <button
            type="button"
            aria-label="T2"
            className="group relative hover:cursor-pointer flex flex-col items-center w-fit transform-gpu transition-all duration-500 ease-out"
            onMouseEnter={() => setHovered({ type: "T2", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T2", 0)}
          >
            <svg
              width="58"
              height="34"
              viewBox="0 0 93 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 0.566345L0.0172992 17.1755L0 17.3873H1.53963L1.55693 17.2058C2.49108 6.05661 5.73901 2.10535 13.9648 2.10535H19.8638V54.7082H14.008V56.2472H32.3798V54.7082H26.7662L26.684 2.10535H32.6652C40.8304 2.10535 44.0524 6.05661 44.9909 17.2058L45.0082 17.3873H46.5435L45.3758 0.566345H1.1677Z"
                className={
                  activeMobile?.type === "T2"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M90.8296 44.3026L88.8791 49.7496H62.7746C79.8922 36.6076 88.572 24.5333 88.572 13.8554C88.572 5.17901 82.2362 0 71.6188 0C62.567 0 55.4787 6.48025 55.4787 14.7502C55.4787 18.1352 57.0442 20.1541 59.6651 20.1541C62.2859 20.1541 63.4449 18.1136 63.4449 16.2158C63.4449 14.8151 63.2374 13.7127 63.0341 12.6406C62.8352 11.5901 62.6319 10.505 62.6319 9.14325C62.6319 5.35626 65.3868 1.539 71.541 1.539C78.1017 1.539 81.4275 5.68481 81.4275 13.8597C81.4275 25.3028 73.366 38.674 58.7266 51.5091L57.8962 52.2224C56.4431 53.4718 54.2504 55.3653 53.5325 55.8884L53.0352 56.2515H88.3558L92.4773 44.3069H90.8339L90.8296 44.3026Z"
                className={
                  activeMobile?.type === "T2"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-[15px] h-[2px] w-[52px] bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeMobile?.type === "T2"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>

          <img src="/detailsApartments/dot.svg" alt="Separator dot" className="h-1.5 w-auto self-center" />

          {/* T3 */}
          <button
            type="button"
            aria-label="T3"
            className="group relative hover:cursor-pointer flex flex-col items-center w-fit transform-gpu transition-all duration-500 ease-out"
            onMouseEnter={() => setHovered({ type: "T3", shapeIndex: null })}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openFor("T3", 0)}
          >
            <svg
              width="58"
              height="34"
              viewBox="0 0 93 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto transition-all duration-500 ease-out"
            >
              <path
                d="M1.1677 0.566284L0.0172992 17.1755L0 17.3873H1.53963L1.55693 17.2057C2.49108 6.05655 5.73901 2.10529 13.9648 2.10529H19.8638V54.7082H14.008V56.2472H32.3798V54.7082H26.7662L26.684 2.10529H32.6652C40.8304 2.10529 44.0524 6.05655 44.9909 17.2057L45.0082 17.3873H46.5435L45.3758 0.566284H1.1677Z"
                className={
                  activeMobile?.type === "T3"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M76.938 23.954C83.1874 21.572 87.1878 16.6827 87.1878 11.3351C87.1878 4.2366 81.7602 0 72.6738 0C64.3572 0 58.3241 5.52056 58.3241 13.1248C58.3241 16.4017 59.8205 18.2822 62.4283 18.2822C65.2178 18.2822 66.2082 16.2936 66.2082 14.586C66.2082 13.1161 65.9401 11.9532 65.6806 10.8292C65.4514 9.83493 65.2308 8.89684 65.2308 7.83769C65.2308 3.95127 68.0852 1.53468 72.6738 1.53468C77.7684 1.53468 80.6876 5.07527 80.6876 11.2529C80.6876 16.6524 77.6127 21.745 73.2014 23.6514C68.9977 23.6601 65.3173 24.6976 65.3173 25.8821C65.3173 26.1242 65.4341 26.3317 65.6546 26.483C66.9002 27.339 71.718 26.3749 74.4037 25.3547C80.9341 26.5262 84.6751 31.8436 84.6751 39.945C84.6751 51.1114 78.123 55.1362 72.5138 55.1924C66.6839 55.1924 63.8512 52.9185 63.8512 48.2366C63.8512 47.1645 64.0544 46.2221 64.2664 45.2278C64.4999 44.1254 64.7464 42.9884 64.7464 41.5705C64.7464 39.7548 63.7777 37.6321 61.0487 37.6321C58.3198 37.6321 56.8623 39.6208 56.8623 42.9538C56.8623 51.2411 63.1506 56.8092 72.5138 56.8092C81.8769 56.8092 92.0705 51.4789 92.0705 39.7807C92.0705 31.7701 86.2969 25.7524 76.9423 23.9454L76.938 23.954Z"
                className={
                  activeMobile?.type === "T3"
                    ? "fill-[#F1B44A]"
                    : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-[15px] h-[2px] w-[52px] bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                activeMobile?.type === "T3"
                  ? "scale-x-100 opacity-100"
                  : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Scalable SVG overlay - Mobile */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-10 lg:hidden"
        aria-label={t("details_apartments.map_alt")}
      >
        {(["T1", "T2", "T3"] as ApartmentType[]).map((type) => (
          <g key={`m-${type}`}>
            {SHAPES_MOBILE[type].map((r, i) => {
              const isTypeActive = activeMobile?.type === type;
              const isAllShapesActive =
                isTypeActive && activeMobile?.shapeIndex === null;
              const isThisShapeActive = isTypeActive && activeMobile?.shapeIndex === i;
              const highlighted = isAllShapesActive || isThisShapeActive;

              return (
                <rect
                  key={`m-${type}-${i}`}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill={"transparent"}
                  stroke={highlighted ? GOLD : "rgba(241,180,74,0.6)"}
                  strokeWidth={highlighted ? 2 : 0}
                  className="transition-all duration-300 ease-out"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    setHovered({ type, shapeIndex: i });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onPointerUp={() => openFor(type, i)}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Scalable SVG overlay - Desktop */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-10 hidden lg:block"
        aria-label={t("details_apartments.map_alt")}
      >
        {(["T1", "T2", "T3"] as ApartmentType[]).map((type) => (
          <g key={`d-${type}`}>
            {SHAPES_DESKTOP[type].map((r, i) => {
              const isTypeActive = activeDesktop?.type === type;
              const isAllShapesActive =
                isTypeActive && activeDesktop?.shapeIndex === null;
              const isThisShapeActive = isTypeActive && activeDesktop?.shapeIndex === i;
              const highlighted = isAllShapesActive || isThisShapeActive;

              return (
                <rect
                  key={`d-${type}-${i}`}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill={"transparent"}
                  stroke={highlighted ? GOLD : "rgba(241,180,74,0.6)"}
                  strokeWidth={highlighted ? 6 : 0}
                  className="transition-all duration-300 ease-out"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    setHovered({ type, shapeIndex: i });
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onPointerUp={() => openFor(type, i)}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Sheet with carousel - 1/3 width */}
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setSelected(null);
            setHovered(null);
            setEnableDefaultMobileHighlight(false);
          }
        }}
      >
        <SheetContent
          side="right"
          showOverlay={false}
          className="text-white w-full max-w-none lg:max-w-[50%] xl:max-w-[42%] border-l border-transparent overflow-hidden"
        >
          <SheetTitle hidden />
          {selected && ALL_APARTMENTS[current] && (
            <div className="h-full flex flex-col relative overflow-hidden">
              <SheetClose asChild>
                <Button
                  type="button"
                  className="absolute bg-transparent hover:bg-transparent top-4 sm:top-6 lg:top-8 cursor-pointer font-normal font-montserrat lg:text-[40px] text-[28px] sm:text-[32px] right-8 sm:right-10 lg:right-12 z-50 text-[#B0C4CC]/50 hover:text-[#B0C4CC] focus:outline-hidden"
                  aria-label={t("details_apartments.close")}
                >
                  x
                </Button>
              </SheetClose>
              <div className="flex-1 bg-[#0B1D26]/90 flex flex-col items-center justify-center relative z-10 px-2 md:px-8 py-2 sm:py-3 lg:py-4 min-h-0">
                {/* Carousel - Floor Plan Images */}
                <Carousel
                  setApi={setApi}
                  className="w-full pb-2 sm:pb-4 lg:pb-6 relative pt-6 sm:pt-8 lg:pt-10 shrink min-h-0"
                  opts={{
                    align: "center",
                    loop: true,
                  }}
                >
                  {/* Mobile Layout: Arrows on sides of floor plan */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6 w-full relative px-8 sm:px-12 md:px-16 lg:hidden">
                    <CarouselPrevious className="absolute left-0 translate-y-12 sm:translate-y-16 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 z-10 disabled:opacity-100 disabled:pointer-events-auto" />
                    <CarouselContent className="ml-0 flex-1 w-full">
                      {ALL_APARTMENTS.map((apartment) => (
                        <CarouselItem
                          key={`${apartment.type}-${apartment.modelIndex}`}
                          className="pl-0"
                        >
                          <div className="flex justify-center items-center">
                            <div className="relative w-full max-w-[400px] sm:max-w-[500px] md:max-w-[550px] aspect-auto">
                              <img
                                src={`/detailsApartments/${apartment.type}.svg`}
                                alt={`${apartment.type} floor plan`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselNext className="absolute right-0 translate-y-12 sm:translate-y-16 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 z-10 disabled:opacity-100 disabled:pointer-events-auto" />
                  </div>

                  {/* Desktop Layout: Floor plan images */}
                  <div className="hidden lg:block">
                    <CarouselContent className="ml-0">
                      {ALL_APARTMENTS.map((apartment) => (
                        <CarouselItem
                          key={`${apartment.type}-${apartment.modelIndex}`}
                          className="pl-0"
                        >
                          <div className="flex justify-center items-center">
                            <div className="relative w-full max-w-[450px] xl:max-w-[500px] aspect-auto">
                              <img
                                src={`/detailsApartments/${apartment.type}.svg`}
                                alt={`${apartment.type} floor plan`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>


                  {/* Text below floor plan for mobile */}
                  <div className="text-center items-center justify-center self-center flex flex-col gap-0 pt-2 sm:pt-4 lg:hidden">
                    {ALL_APARTMENTS[current] && (
                      <>
                        <h2 className="text-[#E1B260] mb-0">
                          <span className="font-playfairDisplay text-[22px] md:text-[48px]">
                            {ALL_APARTMENTS[current].type.charAt(0)}
                          </span>
                          <span className="font-libreCaslonDisplay text-[22px] md:text-[48px]">
                            {ALL_APARTMENTS[current].type.charAt(1)}
                          </span><span className="mr-2 md:mr-4"></span>
                          <span className="font-playpenSans text-[18px] md:text-[38px] leading-[22px] md:leading-[48px]">
                            -
                          </span><span className="mr-2 md:mr-4"></span>
                          <span className="font-playfairDisplay md:text-[54px] text-[22px]">
                            {t("details_apartments.model")}{" "}
                            {getModelLetter(
                              ALL_APARTMENTS[current].modelIndex
                            ).toUpperCase()}
                          </span>
                        </h2>
                        <p className="text-[#B0C4CC] -mt-1 md:-mt-2">
                          <span className="font-libreCaslonDisplay leading-[30px] md:leading-[52px] text-[19px] md:text-[42px]">
                            {formatUnitsForRender(ALL_APARTMENTS[current].model).number}{" "}
                          </span>{" "}
                          <span className="font-playfairDisplay leading-[30px] md:leading-[52px] text-[19px] md:text-[42px]">
                            {formatUnitsForRender(ALL_APARTMENTS[current].model).word}{" "}
                          </span>
                          <span className="font-playpenSans md:text-[32px] text-[19px] md:leading-[52px] leading-[30px]">
                          | {" "}
                          </span>{" "}
                          {formatFloorsForRender(ALL_APARTMENTS[current].model).map((part, i, arr) => (
                            <span
                              key={i}
                              className={`${
                                part.isNumber ? "font-libreCaslonDisplay" : "font-playfairDisplay"
                              } leading-[30px] md:leading-[52px] text-[19px] md:text-[42px]`}
                            >
                              {part.text}{i < arr.length - 1 ? " " : ""}
                            </span>
                          ))}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Title Section with Navigation Arrows - Below Carousel for desktop */}
                  <div className="hidden lg:flex items-center justify-center gap-6 w-full pt-4 relative px-16 xl:px-20">
                    <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 disabled:opacity-100 disabled:pointer-events-auto" />

                    <div className="text-center items-center justify-center self-center flex flex-col gap-0">
                      {ALL_APARTMENTS[current] && (
                        <>
                          <h2 className="text-[#E1B260] mb-0">
                            <span className="font-playfairDisplay text-[48px]">
                              {ALL_APARTMENTS[current].type.charAt(0)}
                            </span>
                            <span className="font-libreCaslonDisplay text-[48px]">
                              {ALL_APARTMENTS[current].type.charAt(1)}
                            </span><span className="mr-4"></span>
                            <span className="font-playpenSans text-[38px] leading-[48px]">
                              -
                            </span><span className="mr-4"></span>
                            <span className="font-playfairDisplay text-[54px]">
                              {t("details_apartments.model")}{" "}
                              {getModelLetter(
                                ALL_APARTMENTS[current].modelIndex
                              ).toUpperCase()}
                            </span>
                          </h2>
                          <p className="text-[#B0C4CC] -mt-2">
                            <span className="font-libreCaslonDisplay leading-[52px] text-[42px]">
                              {formatUnitsForRender(ALL_APARTMENTS[current].model).number}{" "}
                            </span>{" "}
                            <span className="font-playfairDisplay leading-[52px] text-[42px]">
                              {formatUnitsForRender(ALL_APARTMENTS[current].model).word}{" "}
                            </span>
                            <span className="font-playpenSans text-[32px] leading-[52px]">
                            - {" "}
                            </span>{" "}
                            {formatFloorsForRender(ALL_APARTMENTS[current].model).map((part, i, arr) => (
                              <span
                                key={i}
                                className={`${
                                  part.isNumber ? "font-libreCaslonDisplay" : "font-playfairDisplay"
                                } leading-[52px] text-[42px]`}
                              >
                                {part.text}{i < arr.length - 1 ? " " : ""}
                              </span>
                            ))}
                          </p>
                        </>
                      )}
                    </div>

                    <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-transparent border border-[#7192A2] text-white hover:bg-white/40 hover:border-white/40 hover:text-white shrink-0 disabled:opacity-100 disabled:pointer-events-auto" />
                  </div>
                </Carousel>

                {/* Content Container - All content below carousel */}
                <div className="shrink-0">
                  {/* Stats Grid - Mobile: 2x2 layout, Desktop: 3 columns */}
                  <div className="lg:grid lg:grid-rows-2 lg:pb-6 lg:grid-cols-[1fr_8px_1fr_36px_1fr] lg:items-center lg:justify-center">
                    {/* Mobile: Two flex rows with separators */}
                    <div className="lg:hidden relative pb-4 sm:pb-6">
                      <div className="flex flex-col gap-4 sm:gap-5 items-center">
                        {/* Row 1: Suites and Parking */}
                        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                          {/* Suites */}
                          <div className="flex flex-col justify-center items-center flex-[0.8]">
                            <span className="text-white md:text-[48px] text-[40px] font-libreCaslonDisplay leading-none ">
                              {ALL_APARTMENTS[current].model.suites}
                            </span>
                            <div className="text-white font-playfairDisplay text-[26px] sm:text-[28px] leading-[20px] mt-1 sm:mt-2 text-center">
                              {t("details_apartments.suite")}
                            </div>
                          </div>
                          
                          {/* Separator */}
                          <div
                            className="w-px h-[60px] sm:h-[70px] bg-[#E1B260] opacity-60"
                          />  
                          
                          {/* Parking */}
                          <div className="flex flex-col justify-center items-center flex-[1.2]">
                            <span className="text-white md:text-[48px] text-[40px] font-libreCaslonDisplay leading-none">
                              {ALL_APARTMENTS[current].model.parking}
                            </span>
                            <div className="text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty text-sm sm:text-base leading-[20px] sm:leading-[22px] mt-1 sm:mt-2 text-center">
                              {t("details_apartments.parking_spaces")}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Bathrooms and Area */}
                        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                          {/* Bathrooms */}
                          <div className="flex flex-col justify-center items-center flex-[0.8]">
                            <span className="text-white md:text-[48px] text-[40px] font-libreCaslonDisplay leading-none">
                              {ALL_APARTMENTS[current].model.bathrooms}
                            </span>
                            <div className="text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty text-sm sm:text-base leading-[20px] sm:leading-[22px] mt-1 sm:mt-2 text-center">
                              {t("details_apartments.bathrooms")}
                            </div>
                          </div>
                          
                          {/* Separator */}
                          <div
                            className="w-px h-[60px] sm:h-[70px] bg-[#E1B260] opacity-60"
                          />
                          
                          {/* Area */}
                          <div className="flex flex-col justify-center items-center flex-[1.2]">
                            <span className="text-white md:text-[48px] text-[40px] font-libreCaslonDisplay leading-none whitespace-nowrap">
                              + {ALL_APARTMENTS[current].model.area} m²
                            </span>
                            <div className="text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty text-sm sm:text-base leading-[20px] sm:leading-[22px] mt-1 sm:mt-2 text-center">
                              {t("details_apartments.gross_construction_area")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Original 3-column layout */}
                    {/* Row 1: Numbers */}
                    <div className="hidden lg:flex justify-center items-center">
                      <span className="text-white text-[48px] xl:text-[53px] font-libreCaslonDisplay leading-none">
                        {ALL_APARTMENTS[current].model.suites}
                      </span>
                    </div>
                    {/* Separator spanning two rows */}
                    <div
                      className="hidden lg:block row-span-2 self-center"
                      style={{ width: "1px", height: "100px", borderLeft: "0.2px solid #E1B260", opacity: 0.6 }}
                    />
                    <div className="hidden lg:flex justify-center items-center">
                      <span className="text-white text-[48px] xl:text-[53px] font-libreCaslonDisplay leading-none">
                        {ALL_APARTMENTS[current].model.bathrooms}
                      </span>
                    </div>
                    {/* Separator spanning two rows */}
                    <div
                      className="hidden lg:block row-span-2 self-center"
                      style={{ width: "1px", height: "100px", borderLeft: "0.2px solid #E1B260", opacity: 0.6 }}
                    />
                    <div className="hidden lg:flex justify-center items-center">
                      <span className="text-white text-[48px] xl:text-[53px] font-libreCaslonDisplay leading-none">
                        {ALL_APARTMENTS[current].model.parking}
                      </span>
                    </div>

                    {/* Row 2: Labels */}
                    <div className="hidden lg:block text-white font-playfairDisplay text-[28px] xl:text-[30px] leading-[20px] xl:leading-[22px] text-center">
                      {t("details_apartments.suite")}
                    </div>
                    {/* placeholder for sep column (occupied by row-span-2) */}
                    <div className="hidden lg:block text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty max-w-[100px] mx-auto text-sm xl:text-base leading-[20px] xl:leading-[22px] text-center">
                      {t("details_apartments.bathrooms")}
                    </div>
                    {/* placeholder for sep column (occupied by row-span-2) */}
                    <div className="hidden lg:block text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty max-w-[160px] mx-auto text-sm xl:text-base leading-[20px] xl:leading-[22px] text-center">
                      {t("details_apartments.parking_spaces")}
                    </div>
                  </div>

                  {/* Area Information - Desktop only */}
                  <div className="hidden lg:block text-center pb-6">
                    <div className="flex justify-center items-center pb-1 xl:pb-2 h-6 xl:h-8">
                      <span className="text-white text-3xl xl:text-4xl 2xl:text-5xl font-libreCaslonDisplay">
                        + {ALL_APARTMENTS[current].model.area} m²
                      </span>
                    </div>
                    <div className="text-[#B0C4CC] font-montserrat tracking-[0.02em] text-pretty mx-auto text-sm xl:text-base leading-[20px] xl:leading-[22px]">
                      {t("details_apartments.gross_construction_area")}
                    </div>
                  </div>

                  {/* VER MAIS Button */}
                  <div className="flex justify-center pt-2 sm:pt-4">
                    <Button
                      className="w-[140px] sm:w-[160px] h-[26px] sm:h-[28px] uppercase bg-transparent border border-[#7192A2] cursor-pointer rounded-[6px] text-white tracking-wider hover:bg-[#7192A2] transition-colors font-montserrat text-sm md:text-base flex items-center justify-center"
                      onClick={() => {
                        // Add navigation or action here
                        console.log("VER MAIS clicked");
                      }}
                    >
                      <span className="font-montserrat font-semibold md:text-[11px] text-[10px] leading-[26px] sm:leading-[28px] flex items-center text-center tracking-[0.15em] uppercase text-white">
                        {t("details_apartments.see_more")}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
