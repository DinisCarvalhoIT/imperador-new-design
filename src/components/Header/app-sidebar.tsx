"use client";
import {
  DoorClosed,
  LogOut,
  NotebookPen,
  PhoneForwarded,
  MapPinned,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  {
    titleKey: "home",
    sectionId: "",
  },
  {
    titleKey: "typologies",
    sectionId: null, // Has dropdown, no direct scroll
  },
  {
    titleKey: "gallery",
    sectionId: "gallery",
  },
  {
    titleKey: "location",
    sectionId: "location",
  },
  {
    titleKey: "contacts",
    sectionId: "contacts",
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  translations: {
    menu: string;
    home: string;
    typologies: string;
    gallery: string;
    location: string;
    contacts: string;
    schedule_visit: string;
    close: string;
  };
  lang?: string;
}

export function AppSidebar({ translations, lang, ...props }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  const [isTipologiasOpen, setIsTipologiasOpen] = useState(false);

  const tipologias = ["T1", "T2", "T3"];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpenMobile(false); // Close sidebar after clicking
    }
  };

  const handleMenuClick = (item: (typeof items)[0]) => {
    if (item.titleKey === "home") {
      window.location.href = "/";
      setOpenMobile(false);
    } else if (item.sectionId) {
      scrollToSection(item.sectionId);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="">
      <SidebarContent className="flex flex-col items-center justify-center px-3 py-4 gap-8 relative">
        <button
          onClick={() => setOpenMobile(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={translations.close}
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center justify-center w-full">
          <h2 className="text-3xl font-semibold text-[#F1B44A] font-playfairDisplay">
            {translations.menu}
          </h2>
        </div>
        <SidebarGroup className="pb-3">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 flex flex-col items-center">
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey} className="w-full">
                  {item.titleKey === "typologies" ? (
                    <div className="w-full">
                      <SidebarMenuButton
                        className="group relative h-12 px-4 rounded-lg transition-all duration-200 hover:bg-[#2f577a]/10 hover:shadow-sm font-roboto gap-3 w-full justify-center"
                        onClick={() => setIsTipologiasOpen(!isTipologiasOpen)}
                      >
                        <span className=" text-white font-light font-playfairDisplay text-xl tracking-wide">
                          {
                            translations[
                              item.titleKey as keyof typeof translations
                            ]
                          }
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-white transition-transform duration-200 ${
                            isTipologiasOpen ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                      {isTipologiasOpen && (
                        <div className="mt-2 space-y-2 pl-4">
                          {tipologias.map((tipo) => (
                            <button
                              key={tipo}
                              className="w-full h-10 px-4 rounded-lg font-playfairDisplay text-white font-medium text-lg transition-all duration-200 tracking-wide cursor-pointer"
                              onClick={() => {
                                const route =
                                  lang === "pt"
                                    ? `/pt/${tipo.toLowerCase()}`
                                    : `/${tipo.toLowerCase()}`;
                                window.location.href = route;
                                setOpenMobile(false);
                              }}
                            >
                              {tipo}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton
                      className="group relative h-12 px-4 rounded-lg transition-all duration-200 hover:bg-[#2f577a]/10 hover:shadow-sm font-roboto gap-3 w-full justify-center"
                      onClick={() => handleMenuClick(item)}
                    >
                      <span className=" text-white font-light font-playfairDisplay text-xl tracking-wide ">
                        {
                          translations[
                            item.titleKey as keyof typeof translations
                          ]
                        }
                      </span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Button
          className="bg-transparent border border-white hover:bg-white hover:text-black w-[200px] h-[40px] text-md font-montserrat text-white rounded-md font-medium p-0 tracking-widest"
          onClick={() => scrollToSection("contacts")}
        >
          {translations.schedule_visit}
        </Button>
      </SidebarContent>
    </Sidebar>
  );
}
