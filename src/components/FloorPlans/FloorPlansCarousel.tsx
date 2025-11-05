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

type DataCarousel = {
  id: string;
  floorPlanImage: string;
  smallImageCollumnTable: boolean;
  smallImageStyle: string;
  smallFloorPlanImage: string;
  tableImage: string;
  tableImageStyle: string;
  mainTitle: string;
  mobileMainTitle: string;
  subTitle: string;
};

const dataCarousel: DataCarousel[] = [
  {
    id: "floor-plan-1",
    floorPlanImage: "/FloorPlans/T1_Modelo_A.png",
    smallImageCollumnTable: true,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitle: "T1 - modelo A",
    mobileMainTitle: "T1-A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-2",
    floorPlanImage: "/FloorPlans/T1_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[270px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitle: "T1 - modelo B",
    mobileMainTitle: "T1-B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-3",
    floorPlanImage: "/FloorPlans/T1_Modelo_C.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_C_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_C_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitle: "T1 - modelo C",
    mobileMainTitle: "T1-C",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-4",
    floorPlanImage: "/FloorPlans/T2_Modelo_A.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex absolute bottom-50 xl:bottom-52 -right-11 xl:-right-5 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[400px] h-full max-h-[330px] sm:max-h-[360px] md:max-h-[450px] lg:max-h-[450px] flex items-center justify-center",
    mainTitle: "T2 - modelo A",
    mobileMainTitle: "T2-A",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-5",
    floorPlanImage: "/FloorPlans/T2_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      " hidden lg:flex absolute bottom-50 xl:bottom-53 -left-2 xl:-left-4 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] xl:w-[171px] xl:h-[89px] lg:w-[141px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[400px] h-full max-h-[330px] sm:max-h-[360px] md:max-h-[450px] lg:max-h-[450px] flex items-center justify-center",
    mainTitle: "T2 - modelo B",
    mobileMainTitle: "T2-B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-6",
    floorPlanImage: "/FloorPlans/T3_Modelo_A.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex absolute bottom-100 xl:bottom-110 -right-17 xl:-right-7 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[400px] h-full max-h-[370px] sm:max-h-[400px] md:max-h-[480px] lg:max-h-[450px] flex items-center justify-center",
    mainTitle: "T3 - modelo A",
    mobileMainTitle: "T3-A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-7",
    floorPlanImage: "/FloorPlans/T3_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      " hidden lg:flex absolute bottom-110 xl:bottom-122 -left-2 xl:-left-3 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[100px] lg:h-[89px] xl:w-[150px] xl:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[400px] h-full max-h-[370px] sm:max-h-[400px] md:max-h-[480px] lg:max-h-[450px] flex items-center justify-center",
    mainTitle: "T3 - modelo B",
    mobileMainTitle: "T3-B",
    subTitle: "1 Unidade - Piso Térreo",
  },
];
// absolute inset-0 ---- no primeiro div itnha
export default function FloorPlansCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
            <div className="flex flex-col items-center">
              <div
                className={`lg:text-3xl md:text-2xl text-xl text-white font-playfairDisplay transition-opacity duration-300 ${
                  data.index === current
                    ? "opacity-100 font-normal pb-3"
                    : "opacity-60 pb-3"
                }`}
              >
                <span className="md:hidden">{data.mobileMainTitle}</span>
                <span className="hidden md:inline">{data.mainTitle}</span>
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
                        <span className="lg:hidden">
                          {data.mobileMainTitle}
                        </span>
                        <span className="hidden lg:inline">
                          {data.mainTitle}
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#024C67] font-playfairDisplay text-center">
                        {data.subTitle}
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
          <CarouselPreviousFloorPlans className=" absolute -top-7 left-2 sm:left-15" />
          <CarouselNextFloorPlans className="absolute -top-7 right-2 sm:right-15 " />
        </div>
        <div className="hidden md:block">
          <CarouselPreviousFloorPlans />
          <CarouselNextFloorPlans />
        </div>
      </Carousel>
    </div>
  );
}
