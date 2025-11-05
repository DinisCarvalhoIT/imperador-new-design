import { Button } from "@/components/ui/button";

interface BooksTriggersProps {}

export default function BooksTriggers({}: BooksTriggersProps) {
  return (
    <>
      {/* Left Book Trigger: Main Promotional */}
      <Button
        variant="ghost"
        className="group cursor-pointer hover:bg-transparent relative w-full max-w-[555px] h-[350px] md:h-[400px] xl:w-[555px] xl:h-[529px] rounded-lg overflow-hidden p-0 border border-[#7192A2] transition-all hover:scale-[1.02] bg-transparent"
        id="book-trigger-main"
        aria-label="Open Imperador Apartamentos Book"
      >
        <div className="relative w-full h-full">
          {/* Background Image */}
          <img
            src="/book/book-cover-main.png"
            alt="Imperador Apartamentos Book"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/HomePage/homePageImage.png";
            }}
          />

          {/* Arrow Button Overlay (Bottom Right) */}
          <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-white/80 border border-[#7192A2] flex items-center justify-center transition-all pointer-events-none">
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
          </div>
        </div>
      </Button>

      {/* Right Book Trigger: Map/Finishes */}
      <Button
        variant="ghost"
        className="group cursor-pointer hover:bg-transparent relative w-full max-w-[555px] h-[350px] md:h-[400px] xl:w-[555px] xl:h-[529px] rounded-lg overflow-hidden p-0 border border-[#7192A2]  transition-all hover:scale-[1.02] bg-transparent"
        id="book-trigger-finishes"
        aria-label="Open Finishes Map Book"
      >
        <div className="relative w-full h-full">
          {/* Background Image */}
          <img
            src="/book/book-cover-finishes.png"
            alt="Mapa de Acabamentos Book"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/HomePage/homePageImage.png";
            }}
          />

          {/* Arrow Button Overlay (Bottom Right) */}
          <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-white/80 border border-[#7192A2] flex items-center justify-center transition-all   pointer-events-none">
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
          </div>
        </div>
      </Button>
    </>
  );
}
