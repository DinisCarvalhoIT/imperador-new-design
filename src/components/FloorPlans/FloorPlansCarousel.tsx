import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type DataCarousel = {
  id: string;
  floorPlanImage: string;
  smallFloorPlanImage: string;
  tableImage: string;
  mainTitle: string;
  subTitle: string;
};

const dataCarousel: DataCarousel[] = [
  {
    id: "floor-plan-1",
    floorPlanImage: "/FloorPlans/T1_Modelo_A.png",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_A_Table.svg",
    mainTitle: "T1 - modelo A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-2",
    floorPlanImage: "/FloorPlans/T1_Modelo_B.png",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_B_Table.svg",
    mainTitle: "T1 - modelo B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-3",
    floorPlanImage: "/FloorPlans/T1_Modelo_C.png",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_C_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_C_Table.svg",
    mainTitle: "T1 - modelo C",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-4",
    floorPlanImage: "/FloorPlans/T2_Modelo_A.png",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_A_Table.svg",
    mainTitle: "T2 - modelo A",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-5",
    floorPlanImage: "/FloorPlans/T2_Modelo_B.png",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_B_Table.svg",
    mainTitle: "T2 - modelo B",
    subTitle: "7 Unidades - Piso 1 a 7",
  },
  {
    id: "floor-plan-6",
    floorPlanImage: "/FloorPlans/T3_Modelo_A.png",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_A_Table.svg",
    mainTitle: "T3 - modelo A",
    subTitle: "1 Unidade - Piso Térreo",
  },
  {
    id: "floor-plan-7",
    floorPlanImage: "/FloorPlans/T3_Modelo_B.png",
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
                  <div className="">
                    <img
                      src={data.floorPlanImage}
                      alt={data.id}
                      width={546}
                      height={713}
                      className="w-[546px] h-[713px]"
                    />
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
                      className="w-[382px] h-[414px]"
                    />
                    <img
                      src={data.smallFloorPlanImage}
                      alt={data.id}
                      width={171}
                      height={89}
                      className="w-[171px] h-[89px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
    </div>
  );
}
