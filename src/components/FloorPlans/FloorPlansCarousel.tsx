import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextFloorPlans,
  CarouselPreviousFloorPlans,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type DataCarousel = {
  id: string;
  floorPlanImage: string;
  floorPlanImageSize: string;
  floorPlanTableSize: string;
  smallImageCollumnTable: boolean;
  smallImageStyle: string;
  smallFloorPlanImage: string;
  tableImage: string;
  mainTitle: string;
  subTitle: string;
};

const dataCarousel: DataCarousel[] = [
  {
    id: "floor-plan-1",
    floorPlanImage: "/FloorPlans/T1_Modelo_A.png",
    floorPlanImageSize: "2xl:w-[546px] 2xl:h-[713px] w-[460px] h-[613px]",
    floorPlanTableSize: "w-[382px] h-[414px]",
    smallImageCollumnTable: true,
    smallImageStyle: "w-[171px] h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_A_Table.svg",
    mainTitle: "T1 - modelo A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-2",
    floorPlanImage: "/FloorPlans/T1_Modelo_B.png",
    floorPlanImageSize: "2xl:w-[546px] 2xl:h-[511px] w-[480px] h-[461px]",
    floorPlanTableSize: "w-[382px] h-[447px]",
    smallImageCollumnTable: false,
    smallImageStyle: "w-[171px] h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_B_Table.svg",
    mainTitle: "T1 - modelo B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-3",
    floorPlanImage: "/FloorPlans/T1_Modelo_C.png",
    floorPlanImageSize: "2xl:w-[546px] 2xl:h-[511px] w-[480px] h-[461px]",
    floorPlanTableSize: "w-[382px] h-[447px]",
    smallImageCollumnTable: false,
    smallImageStyle: "w-[171px] h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_C_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_C_Table.svg",
    mainTitle: "T1 - modelo C",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-4",
    floorPlanImage: "/FloorPlans/T2_Modelo_A.png",
    floorPlanImageSize: "2xl:w-[603px] 2xl:h-[713px] w-[520px] h-[613px]",
    floorPlanTableSize: "w-[382px] h-[546px]",
    smallImageCollumnTable: false,
    smallImageStyle:
      "absolute 2xl:bottom-66 2xl:-right-5 bottom-72 -right-9 w-[171px] h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_A_Table.svg",
    mainTitle: "T2 - modelo A",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-5",
    floorPlanImage: "/FloorPlans/T2_Modelo_B.png",
    floorPlanImageSize: "2xl:w-[603px] 2xl:h-[713px] w-[520px] h-[613px]",
    floorPlanTableSize: "w-[382px] h-[546px]",
    smallImageCollumnTable: false,
    smallImageStyle:
      "absolute 2xl:bottom-66 2xl:-left-5 bottom-75 -left-4 2xl:w-[171px] 2xl:h-[89px] w-[150px] h-[71px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_B_Table.svg",
    mainTitle: "T2 - modelo B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-6",
    floorPlanImage: "/FloorPlans/T3_Modelo_A.png",
    floorPlanImageSize: "2xl:w-[480px] 2xl:h-[740px] w-[430px] h-[620px]",
    floorPlanTableSize: "2xl:w-[382px] 2xl:h-[590px] w-[350px] h-[510px]",
    smallImageCollumnTable: false,
    smallImageStyle:
      "absolute 2xl:bottom-147 2xl:-right-21 bottom-128 -right-17 2xl:w-[171px] 2xl:h-[89px] w-[140px] h-[71px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_A_Table.svg",
    mainTitle: "T3 - modelo A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-7",
    floorPlanImage: "/FloorPlans/T3_Modelo_B.png",
    floorPlanImageSize: "2xl:w-[480px] 2xl:h-[740px] w-[400px] h-[600px]",
    floorPlanTableSize: "2xl:w-[382px] 2xl:h-[590px] w-[350px] h-[510px]",
    smallImageCollumnTable: false,
    smallImageStyle:
      "absolute 2xl:bottom-151 2xl:-left-27 bottom-140 -left-22 2xl:w-[171px] 2xl:h-[89px] w-[140px] h-[71px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_B_Table.svg",
    mainTitle: "T3 - modelo B",
    subTitle: "1 Unidade - Piso Térreo",
  },
];

export default function FloorPlansCarousel() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <Carousel className="w-[95%] h-[90%]">
        <CarouselContent className="h-full">
          {dataCarousel.map((data, index) => (
            <CarouselItem key={index} className="h-full">
              <Card className="h-full bg-white/86">
                <CardContent className="grid grid-cols-2 h-full items-center justify-items-center">
                  <div className="relative flex flex-col items-center justify-center py-24">
                    <img
                      src={data.floorPlanImage}
                      alt={data.id}
                      width={546}
                      height={713}
                      className={data.floorPlanImageSize}
                    />
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
                  <div className="flex flex-col items-center justify-center gap-y-10">
                    <div className="flex flex-col items-center justify-center gap-y-1">
                      <h1 className="text-6xl text-[#E1B260] font-normal font-playfairDisplay">
                        {data.mainTitle}
                      </h1>
                      <p className="text-2xl text-[#024C67] font-playfairDisplay">
                        {data.subTitle}
                      </p>
                    </div>
                    <img
                      src={data.tableImage}
                      alt={data.id}
                      width={382}
                      height={414}
                      className={data.floorPlanTableSize}
                    />
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
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPreviousFloorPlans />
        <CarouselNextFloorPlans />
      </Carousel>
    </div>
  );
}
