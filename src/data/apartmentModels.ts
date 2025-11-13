// Shared data for all apartment models
// This ensures consistency across all typology pages

export interface ApartmentDetail {
  id: string;
  apartmentImage: string;
  mainTitleKey: string;
  subTitleKey: string;
  features: {
    titleKey: string;
    descriptionKey?: string;
  }[];
}

export interface FloorPlanItem {
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
}

const commonFeatures = [
  {
    titleKey: "apartment_details.suite",
    descriptionKey: "apartment_details.suite_description",
  },
  {
    titleKey: "apartment_details.santos_kitchen",
  },
  {
    titleKey: "apartment_details.miele_appliances",
  },
  {
    titleKey: "apartment_details.advanced_tech",
    descriptionKey: "apartment_details.advanced_tech_description",
  },
  {
    titleKey: "apartment_details.nzeb",
    descriptionKey: "apartment_details.nzeb_description",
  },
];

// T1 Models (A, B, C)
export const t1ApartmentDetails: ApartmentDetail[] = [
  {
    id: "t1-model-a",
    apartmentImage: "/detailsApartments/T1_modeloA.png",
    mainTitleKey: "apartment_details.t1_model_a",
    subTitleKey: "apartment_details.t1_model_a_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking2",
    }],
  },
  {
    id: "t1-model-b",
    apartmentImage: "/detailsApartments/T1_modeloB.png",
    mainTitleKey: "apartment_details.t1_model_b",
    subTitleKey: "apartment_details.t1_model_b_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking2",
    }],
  },
  {
    id: "t1-model-c",
    apartmentImage: "/detailsApartments/T1_modeloC.png",
    mainTitleKey: "apartment_details.t1_model_c",
    subTitleKey: "apartment_details.t1_model_c_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking2",
    }],
  },
];

export const t1FloorPlans: FloorPlanItem[] = [
  {
    id: "floor-plan-t1-a",
    floorPlanImage: "/FloorPlans/T1_Modelo_A.png",
    smallImageCollumnTable: true,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitleKey: "floorplans.t1_model_a",
    mobileTitleKey: "floorplans.t1_model_a_mobile",
    subTitleKey: "floorplans.t1_model_a_subtitle",
  },
  {
    id: "floor-plan-t1-b",
    floorPlanImage: "/FloorPlans/T1_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[270px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitleKey: "floorplans.t1_model_b",
    mobileTitleKey: "floorplans.t1_model_b_mobile",
    subTitleKey: "floorplans.t1_model_b_subtitle",
  },
  {
    id: "floor-plan-t1-c",
    floorPlanImage: "/FloorPlans/T1_Modelo_C.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px] mx-auto",
    smallFloorPlanImage: "/FloorPlans/T1_Modelo_C_Small.svg",
    tableImage: "/FloorPlans/T1_Modelo_C_Table.svg",
    tableImageStyle:
      "w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-full max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[360px] flex items-center justify-center",
    mainTitleKey: "floorplans.t1_model_c",
    mobileTitleKey: "floorplans.t1_model_c_mobile",
    subTitleKey: "floorplans.t1_model_c_subtitle",
  },
];

// T2 Models (A, B)
export const t2ApartmentDetails: ApartmentDetail[] = [
  {
    id: "t2-model-a",
    apartmentImage: "/detailsApartments/T2_modeloA.png",
    mainTitleKey: "apartment_details.t2_model_a",
    subTitleKey: "apartment_details.t2_model_a_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking2",
    }],
  },
  {
    id: "t2-model-b",
    apartmentImage: "/detailsApartments/T2_modeloB.png",
    mainTitleKey: "apartment_details.t2_model_b",
    subTitleKey: "apartment_details.t2_model_b_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking2",
    }],
  },
];

export const t2FloorPlans: FloorPlanItem[] = [
  {
    id: "floor-plan-t2-a",
    floorPlanImage: "/FloorPlans/T2_Modelo_A.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex absolute bottom-50 xl:bottom-52 -right-11 xl:-right-5 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[400px] h-full max-h-[330px] sm:max-h-[360px] md:max-h-[450px] lg:max-h-[450px] flex items-center justify-center",
    mainTitleKey: "floorplans.t2_model_a",
    mobileTitleKey: "floorplans.t2_model_a_mobile",
    subTitleKey: "floorplans.t2_model_a_subtitle",
  },
  {
    id: "floor-plan-t2-b",
    floorPlanImage: "/FloorPlans/T2_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      " hidden lg:flex absolute bottom-50 xl:bottom-53 -left-2 xl:-left-4 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] xl:w-[171px] xl:h-[89px] lg:w-[141px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T2_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T2_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[400px] h-full max-h-[330px] sm:max-h-[360px] md:max-h-[450px] lg:max-h-[450px] flex items-center justify-center",
    mainTitleKey: "floorplans.t2_model_b",
    mobileTitleKey: "floorplans.t2_model_b_mobile",
    subTitleKey: "floorplans.t2_model_b_subtitle",
  },
];

// T3 Models (A, B)
export const t3ApartmentDetails: ApartmentDetail[] = [
  {
    id: "t3-model-a",
    apartmentImage: "/detailsApartments/T3_modeloA.png",
    mainTitleKey: "apartment_details.t3_model_a",
    subTitleKey: "apartment_details.t3_model_a_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking3",
    }],
  },
  {
    id: "t3-model-b",
    apartmentImage: "/detailsApartments/T3_modeloB.png",
    mainTitleKey: "apartment_details.t3_model_b",
    subTitleKey: "apartment_details.t3_model_b_subtitle",
    features: [...commonFeatures, {
      titleKey: "apartment_details.parking3",
    }],
  },
];

export const t3FloorPlans: FloorPlanItem[] = [
  {
    id: "floor-plan-t3-a",
    floorPlanImage: "/FloorPlans/T3_Modelo_A.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      "hidden lg:flex absolute bottom-100 xl:bottom-110 -right-17 xl:-right-7 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[171px] lg:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_A_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_A_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[400px] h-full max-h-[370px] sm:max-h-[400px] md:max-h-[480px] lg:max-h-[450px] flex items-center justify-center",
    mainTitleKey: "floorplans.t3_model_a",
    mobileTitleKey: "floorplans.t3_model_a_mobile",
    subTitleKey: "floorplans.t3_model_a_subtitle",
  },
  {
    id: "floor-plan-t3-b",
    floorPlanImage: "/FloorPlans/T3_Modelo_B.png",
    smallImageCollumnTable: false,
    smallImageStyle:
      " hidden lg:flex absolute bottom-110 xl:bottom-122 -left-2 xl:-left-3 w-[100px] h-[52px] sm:w-[120px] sm:h-[62px] md:w-[140px] md:h-[73px] lg:w-[100px] lg:h-[89px] xl:w-[150px] xl:h-[89px]",
    smallFloorPlanImage: "/FloorPlans/T3_Modelo_B_Small.svg",
    tableImage: "/FloorPlans/T3_Modelo_B_Table.svg",
    tableImageStyle:
      "w-full max-w-[290px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[400px] h-full max-h-[370px] sm:max-h-[400px] md:max-h-[480px] lg:max-h-[450px] flex items-center justify-center",
    mainTitleKey: "floorplans.t3_model_b",
    mobileTitleKey: "floorplans.t3_model_b_mobile",
    subTitleKey: "floorplans.t3_model_b_subtitle",
  },
];

// Helper function to get model index from URL search params (just "a", "b", "c")
export function getModelIndexFromUrl(searchParams: URLSearchParams): number {
  const model = searchParams.get("model");
  if (!model) return 0;

  // Map model strings to indices: a=0, b=1, c=2
  const modelMap: Record<string, number> = {
    "a": 0,
    "b": 1,
    "c": 2,
  };

  return modelMap[model.toLowerCase()] ?? 0;
}

// Helper function to get model string from index (just "a", "b", "c")
export function getModelStringFromIndex(index: number): string {
  const models = ["a", "b", "c"];
  return models[index] ?? "a";
}

