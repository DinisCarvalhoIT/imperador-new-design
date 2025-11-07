import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { HTMLFlipBook } from "./BookFlipbook";
import type { IFlipSetting } from "@/lib/flipbook/settings";

interface BooksTriggersProps {
  lang: string;
  mainBookCoverMobile: string;
  mainBookCoverDesktop: string;
  finishesBookCoverPTMobile: string;
  finishesBookCoverPTDesktop: string;
  finishesBookCoverENMobile: string;
  finishesBookCoverENDesktop: string;
  mainBookPages: string[];
  finishesBookPTPages: string[];
  finishesBookENPages: string[];
}

const ArrowIcon = () => (
  <svg
    viewBox="0 0 9 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12"
  >
    <g clipPath="url(#clip0_397_1388)">
      <path
        d="M0.526271 3.62509H7.73267L4.97322 0.896595C4.82873 0.753715 4.82313 0.516342 4.96075 0.366342C5.0982 0.216529 5.32686 0.210529 5.47153 0.353404L8.62294 3.46965C8.75928 3.6114 8.8346 3.79965 8.8346 4.00009C8.8346 4.20034 8.75928 4.38878 8.61658 4.53672L5.47135 7.64662C5.40146 7.71575 5.31187 7.75008 5.22229 7.75008C5.12692 7.75008 5.03156 7.71108 4.96057 7.63368C4.82295 7.48368 4.82855 7.24648 4.97304 7.10361L7.74404 4.37509H0.526271C0.326871 4.37509 0.165039 4.20709 0.165039 4.00009C0.165039 3.79309 0.326871 3.62509 0.526271 3.62509Z"
        fill="#024C67"
      />
    </g>
    <defs>
      <clipPath id="clip0_397_1388">
        <rect width="9" height="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function BooksTriggers({
  lang = "en",
  mainBookCoverMobile,
  mainBookCoverDesktop,
  finishesBookCoverPTMobile,
  finishesBookCoverPTDesktop,
  finishesBookCoverENMobile,
  finishesBookCoverENDesktop,
  mainBookPages,
  finishesBookPTPages,
  finishesBookENPages,
}: BooksTriggersProps) {
  const [openMainBook, setOpenMainBook] = useState(false);
  const [openFinishesBook, setOpenFinishesBook] = useState(false);

  const finishesBookPages = lang === "pt" ? finishesBookPTPages : finishesBookENPages;

  const mainBookFlipSettings: IFlipSetting = {
    startPage: 0,
    size: "stretch",
    width: 800,
    height: 600,
    minWidth: 400,
    maxWidth: 2000,
    minHeight: 300,
    maxHeight: 1400,
    drawShadow: true,
    flippingTime: 600,
    usePortrait: true,
    startZIndex: 0,
    autoSize: true,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  };

  const finishesBookFlipSettings: IFlipSetting = {
    startPage: 0,
    size: "stretch",
    width: 400,
    height: 600,
    minWidth: 300,
    maxWidth: 1000,
    minHeight: 300,
    maxHeight: 1400,
    drawShadow: true,
    flippingTime: 600,
    usePortrait: true,
    startZIndex: 0,
    autoSize: true,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  };

  return (
    <>
      <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-4 md:gap-7 pl-4 pr-4 md:pr-0 xl:pr-0 pb-6 xl:pb-2 pt-2 w-max xl:w-full xl:max-w-none xl:justify-center">
        {/* Left Book Trigger: Main Promotional */}
        <Button
          variant="ghost"
          className="group cursor-pointer hover:bg-transparent relative w-[400px] h-[283px] xl:w-[747px] xl:h-[529px] shrink-0 rounded-lg overflow-hidden p-0 border border-[#7192A2] transition-all hover:scale-[1.02] bg-transparent"
          id="book-trigger-main"
          aria-label="Open Imperador Apartamentos Book"
          onClick={() => setOpenMainBook(true)}
        >
          <div className="relative w-full h-full">
            <picture>
              <source
                media="(min-width: 1280px)"
                srcSet={mainBookCoverDesktop}
              />
              <img
                src={mainBookCoverMobile}
                alt="Imperador Apartamentos Book"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = mainBookCoverMobile;
                }}
              />
            </picture>
            <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-white/80 border border-[#7192A2] flex items-center justify-center transition-all pointer-events-none">
              <ArrowIcon />
            </div>
          </div>
        </Button>

        {/* Right Book Trigger: Map/Finishes */}
        <Button
          variant="ghost"
          className="group cursor-pointer hover:bg-transparent relative w-[200px] h-[283px] xl:w-[374px] xl:h-[529px] shrink-0 rounded-lg overflow-hidden p-0 border border-[#7192A2] transition-all hover:scale-[1.02] bg-transparent"
          id="book-trigger-finishes"
          aria-label="Open Finishes Map Book"
          onClick={() => setOpenFinishesBook(true)}
        >
          <div className="relative w-full h-full">
            <picture>
              {lang === "pt" ? (
                <>
                  <source
                    media="(min-width: 1280px)"
                    srcSet={finishesBookCoverPTDesktop}
                  />
                  <img
                    src={finishesBookCoverPTMobile}
                    alt="Mapa de Acabamentos Book"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </>
              ) : (
                <>
                  <source
                    media="(min-width: 1280px)"
                    srcSet={finishesBookCoverENDesktop}
                  />
                  <img
                    src={finishesBookCoverENMobile}
                    alt="Mapa de Acabamentos Book"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </>
              )}
            </picture>
            <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-white/80 border border-[#7192A2] flex items-center justify-center transition-all pointer-events-none">
              <ArrowIcon />
            </div>
          </div>
        </Button>
      </div>
      <ScrollBar orientation="horizontal" className="xl:hidden" />
    </ScrollArea>

    {/* Main Book Dialog */}
    <Dialog open={openMainBook} onOpenChange={setOpenMainBook}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center">
            <DialogClose className="absolute top-4 right-4 z-[100] rounded-full bg-white/90 hover:bg-white p-2 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#024C67]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </DialogClose>
            {openMainBook && (
            <HTMLFlipBook
              key="main-book"
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
              }}
              {...mainBookFlipSettings}
            >
              {mainBookPages.map((imageUrl, index) => (
                <div
                  key={`main-page-${index}`}
                  className="page"
                  data-density={index === 0 || index === mainBookPages.length - 1 ? "hard" : "soft"}
                >
                  <img
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                    loading="eager"
                  />
                </div>
              ))}
            </HTMLFlipBook>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>

    {/* Finishes Book Dialog */}
    <Dialog open={openFinishesBook} onOpenChange={setOpenFinishesBook}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center">
            <DialogClose className="absolute top-4 right-4 z-[100] rounded-full bg-white/90 hover:bg-white p-2 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#024C67]"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </DialogClose>
            {openFinishesBook && (
            <HTMLFlipBook
              key="finishes-book"
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
              }}
              {...finishesBookFlipSettings}
            >
              {finishesBookPages.map((imageUrl, index) => (
                <div
                  key={`finishes-page-${index}`}
                  className="page"
                  data-density={index === 0 || index === finishesBookPages.length - 1 ? "hard" : "soft"}
                >
                  <img
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                    loading="eager"
                  />
                </div>
              ))}
            </HTMLFlipBook>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
    </>
  );
}
