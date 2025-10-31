import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

type ApartmentType = "T1" | "T2" | "T3"

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

const BASE_SHAPES: Record<ApartmentType, Rect[]> = {
  // Coordinates in a 1000x1000 viewBox space so the SVG scales with the image
  T1: [
    { x: 419, y: 756, width: 239, height: 78 }, // T1 model a
    { x: 360, y: 215, width: 184, height: 541 }, // T1 model b
    { x: 544, y: 215, width: 179, height: 541 }, // T1 model c
  ],
  T2: [
    { x: 220, y: 215, width: 140, height: 541 }, // T2 model a
    { x: 723, y: 215, width: 140, height: 541 }, // T2 model b
  ],
  T3: [
    { x: 220, y: 756, width: 199, height: 78 }, // T3 model a
    { x: 658, y: 756, width: 205, height: 78 }, // T3 model b
  ],
}

function getScaledShapes(imageWidth: number, imageHeight: number): Record<ApartmentType, Rect[]> {
  const scaleX = imageWidth / 1000;
  const scaleY = imageHeight / 1000;

  return {
    T1: BASE_SHAPES.T1.map(rect => ({
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      width: rect.width * scaleX,
      height: rect.height * scaleY,
    })),
    T2: BASE_SHAPES.T2.map(rect => ({
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      width: rect.width * scaleX,
      height: rect.height * scaleY,
    })),
    T3: BASE_SHAPES.T3.map(rect => ({
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      width: rect.width * scaleX,
      height: rect.height * scaleY,
    })),
  };
}

const GOLD = "#F1B44A"

interface InteractiveBuildingProps {
  imageWidth: number;
  imageHeight: number;
}

type HoverState = {
  type: ApartmentType
  shapeIndex: number | null // null = all shapes of this type, number = specific shape
}

type SelectedState = {
  type: ApartmentType
  shapeIndex: number
}

export default function InteractiveBuilding({ imageWidth, imageHeight }: InteractiveBuildingProps) {
  const [hovered, setHovered] = React.useState<HoverState | null>(null)
  const [selected, setSelected] = React.useState<SelectedState | null>(null)
  const [open, setOpen] = React.useState(false)

  function openFor(type: ApartmentType, shapeIndex: number) {
    setSelected({ type, shapeIndex })
    setOpen(true)
  }

  const active = hovered ?? (selected ? { type: selected.type, shapeIndex: selected.shapeIndex } : null)
  const interacting = Boolean(active)
  const SHAPES = getScaledShapes(imageWidth, imageHeight)

  // Get model letter from shape index (0 = a, 1 = b, 2 = c)
  function getModelLetter(shapeIndex: number): string {
    return String.fromCharCode(97 + shapeIndex) // 'a', 'b', 'c'
  }

  return (
    <div className="absolute inset-0">
      {/* Gradient overlays - solid bands that don't affect apartment shapes */}
      {/* Left gradient band */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1/5 bg-linear-to-r from-[#0F3A4B] to-transparent z-5" />
      {/* Top/Bottom gradients with mask that excludes active shapes */}
      <svg
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-5"
        aria-hidden
      >
        <defs>
          <linearGradient id="gradTop" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0F3A4B" />
            <stop offset="1%" stopColor="#0F3A4B" />
            <stop offset="100%" stopColor="#0F3A4B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradBottom" x1="0" y1="1" x2="0" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#0F3A4B" />
            <stop offset="1%" stopColor="#0F3A4B" />
            <stop offset="100%" stopColor="#0F3A4B" stopOpacity="0" />
          </linearGradient>

          {/* Mask that punches holes where the active shapes are */}
          <mask id="activeHoleMask" maskUnits="userSpaceOnUse">
            {/* White = visible gradient; Black = cut-out */}
            <rect x="0" y="0" width={imageWidth} height={imageHeight} fill="white" />
            {active && (
              active.shapeIndex === null
                ? SHAPES[active.type].map((r, i) => (
                    <rect
                      key={`mask-${active.type}-${i}`}
                      x={r.x}
                      y={r.y}
                      width={r.width}
                      height={r.height}
                      fill="black"
                    />
                  ))
                : (() => {
                    const r = SHAPES[active.type][active.shapeIndex]
                    return (
                      <rect
                        key={`mask-${active.type}-${active.shapeIndex}`}
                        x={r.x}
                        y={r.y}
                        width={r.width}
                        height={r.height}
                        fill="black"
                      />
                    )
                  })()
            )}
          </mask>
        </defs>

        {(() => {
          const topHeight = interacting ? imageHeight * 0.5 : imageHeight * 0.333
          const bottomHeight = interacting ? imageHeight * 0.5 : imageHeight * 0.333
          return (
            <g mask="url(#activeHoleMask)">
              {/* Top band - starts exactly at y=0 to cover full edge */}
              <rect
                x={0}
                y={0}
                width={imageWidth}
                height={topHeight}
                fill="url(#gradTop)"
                style={{ transition: "height 300ms ease-out" }}
              />
              {/* Bottom band - ends exactly at y=imageHeight to cover full edge */}
              <rect
                x={0}
                y={imageHeight - bottomHeight}
                width={imageWidth}
                height={bottomHeight}
                fill="url(#gradBottom)"
                style={{ transition: "height 300ms ease-out, y 300ms ease-out" }}
              />
            </g>
          )
        })()}
      </svg>

      {/* Left selector: T1 / T2 / T3 */}
      <div className="hidden md:flex absolute left-0 top-0 bottom-0 px-6 md:px-12 lg:px-32 items-center z-20">
        <div className="flex flex-col justify-center gap-[49px] w-24 text-white">
          {/* T1 */}
          <button
            type="button"
            aria-label="T1"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
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
                  active?.type === "T1" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M77.1026 55.374V0L76.7652 0.306937C68.7168 7.708 61.3863 10.4834 57.7361 11.4777L57.5372 11.5339L57.9826 12.9778L58.1729 12.9216C62.5323 11.6247 66.9912 9.54962 70.1959 7.34054V55.3696H56.4517V56.9086H90.7646V55.3696H77.1026V55.374Z"
                className={
                  active?.type === "T1" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={
                `mt-[7px] h-0.5 w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                  active?.type === "T1" ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                }`
              }
            />
          </button>
          <img src="/dot.svg" alt="Separator dot" className="h-2 w-auto self-center" />
          {/* T2 */}
          <button
            type="button"
            aria-label="T2"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
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
                  active?.type === "T2" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M90.8296 44.3026L88.8791 49.7496H62.7746C79.8922 36.6076 88.572 24.5333 88.572 13.8554C88.572 5.17901 82.2362 0 71.6188 0C62.567 0 55.4787 6.48025 55.4787 14.7502C55.4787 18.1352 57.0442 20.1541 59.6651 20.1541C62.2859 20.1541 63.4449 18.1136 63.4449 16.2158C63.4449 14.8151 63.2374 13.7127 63.0341 12.6406C62.8352 11.5901 62.6319 10.505 62.6319 9.14325C62.6319 5.35626 65.3868 1.539 71.541 1.539C78.1017 1.539 81.4275 5.68481 81.4275 13.8597C81.4275 25.3028 73.366 38.674 58.7266 51.5091L57.8962 52.2224C56.4431 53.4718 54.2504 55.3653 53.5325 55.8884L53.0352 56.2515H88.3558L92.4773 44.3069H90.8339L90.8296 44.3026Z"
                className={
                  active?.type === "T2" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={
                `mt-[7px] h-0.5 w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                  active?.type === "T2" ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                }`
              }
            />
          </button>
          <img src="/dot.svg" alt="Separator dot" className="h-2 w-auto self-center" />
          {/* T3 */}
          <button
            type="button"
            aria-label="T3"
            className="group hover:cursor-pointer flex flex-col items-start w-fit transform-gpu transition-all duration-500 ease-out opacity-0 translate-y-2 animate-[fadeIn_0.6s_ease-out_forwards]"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
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
                  active?.type === "T3" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
              <path
                d="M76.938 23.954C83.1874 21.572 87.1878 16.6827 87.1878 11.3351C87.1878 4.2366 81.7602 0 72.6738 0C64.3572 0 58.3241 5.52056 58.3241 13.1248C58.3241 16.4017 59.8205 18.2822 62.4283 18.2822C65.2178 18.2822 66.2082 16.2936 66.2082 14.586C66.2082 13.1161 65.9401 11.9532 65.6806 10.8292C65.4514 9.83493 65.2308 8.89684 65.2308 7.83769C65.2308 3.95127 68.0852 1.53468 72.6738 1.53468C77.7684 1.53468 80.6876 5.07527 80.6876 11.2529C80.6876 16.6524 77.6127 21.745 73.2014 23.6514C68.9977 23.6601 65.3173 24.6976 65.3173 25.8821C65.3173 26.1242 65.4341 26.3317 65.6546 26.483C66.9002 27.339 71.718 26.3749 74.4037 25.3547C80.9341 26.5262 84.6751 31.8436 84.6751 39.945C84.6751 51.1114 78.123 55.1362 72.5138 55.1924C66.6839 55.1924 63.8512 52.9185 63.8512 48.2366C63.8512 47.1645 64.0544 46.2221 64.2664 45.2278C64.4999 44.1254 64.7464 42.9884 64.7464 41.5705C64.7464 39.7548 63.7777 37.6321 61.0487 37.6321C58.3198 37.6321 56.8623 39.6208 56.8623 42.9538C56.8623 51.2411 63.1506 56.8092 72.5138 56.8092C81.8769 56.8092 92.0705 51.4789 92.0705 39.7807C92.0705 31.7701 86.2969 25.7524 76.9423 23.9454L76.938 23.954Z"
                className={
                  active?.type === "T3" ? "fill-[#F1B44A]" : "fill-white group-hover:fill-[#F1B44A]"
                }
              />
            </svg>
            <div
              className={
                `mt-[7px] h-0.5 w-full bg-[#F1B44A] transform-gpu transition-[transform,opacity] duration-500 ease-out origin-left ${
                  active?.type === "T3" ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                }`
              }
            />
          </button>
        </div>
      </div>

      {/* Scalable SVG overlay */}
      <svg
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-10"
        aria-label="Mapa das tipologias"
      >
        {(["T1", "T2", "T3"] as ApartmentType[]).map((type) => (
          <g key={type}>
            {SHAPES[type].map((r, i) => {
              // Highlight if:
              // 1. All shapes of this type are active (shapeIndex === null) OR
              // 2. This specific shape is active (type matches and shapeIndex matches)
              const isTypeActive = active?.type === type
              const isAllShapesActive = isTypeActive && active.shapeIndex === null
              const isThisShapeActive = isTypeActive && active.shapeIndex === i
              const highlighted = isAllShapesActive || isThisShapeActive
              
              return (
                <rect
                  key={`${type}-${i}`}
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
                    setHovered({ type, shapeIndex: i })
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => openFor(type, i)}
                />
              )
            })}
          </g>
        ))}
      </svg>

      {/* Right-side sheet with details */}
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setSelected(null)
            setHovered(null)
          }
        }}
      >
        <SheetContent side="right" className="bg-[#0F3A4B] text-white z-20">
          <SheetHeader className="gap-3">
            <SheetTitle className="font-playfairDisplay text-2xl">
              {selected ? `${selected.type} - modelo ${getModelLetter(selected.shapeIndex)}` : "Tipologia"}
            </SheetTitle>
            <SheetDescription className="text-white/80">
              7 Unidades - Piso 1 a 7
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6 space-y-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-playfairDisplay">1</div>
                <div className="text-sm opacity-80">Suite</div>
              </div>
              <div>
                <div className="text-4xl font-playfairDisplay">2</div>
                <div className="text-sm opacity-80">Casas de Banho</div>
              </div>
              <div>
                <div className="text-4xl font-playfairDisplay">2</div>
                <div className="text-sm opacity-80">Lugares de Estacionamento</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-playfairDisplay">+132 m²</div>
              <div className="opacity-80 text-sm">Área Bruta de Construção</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


