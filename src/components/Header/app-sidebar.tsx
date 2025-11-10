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
    titleKey: "Tipologias",
  },
  {
    titleKey: "Galeria",
  },
  {
    titleKey: "Localização",
  },
  {
    titleKey: "Contactos",
  },
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  const { setOpenMobile } = useSidebar();
  const [isTipologiasOpen, setIsTipologiasOpen] = useState(false);

  const tipologias = ["T1", "T2", "T3"];

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-slate-200">
      <SidebarContent className="flex flex-col items-center justify-center px-3 py-4 gap-8 relative">
        <button
          onClick={() => setOpenMobile(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center justify-center w-full">
          <h2 className="text-3xl font-bold text-[#D4AF37] font-roboto">
            Menu
          </h2>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 flex flex-col items-center">
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey} className="w-full">
                  {item.titleKey === "Tipologias" ? (
                    <div className="w-full">
                      <SidebarMenuButton
                        className="group relative h-12 px-4 rounded-lg transition-all duration-200 hover:bg-[#2f577a]/10 hover:shadow-sm font-roboto gap-3 w-full justify-center"
                        onClick={() => setIsTipologiasOpen(!isTipologiasOpen)}
                      >
                        <span className=" text-[#2f577a] group-hover:text-[#2f577a] font-semibold text-lg ">
                          {item.titleKey}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#2f577a] transition-transform duration-200 ${
                            isTipologiasOpen ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                      {isTipologiasOpen && (
                        <div className="mt-2 space-y-2 pl-4">
                          {tipologias.map((tipo) => (
                            <button
                              key={tipo}
                              className="w-full h-10 px-4 rounded-lg text-[#2f577a] hover:bg-[#2f577a]/10 font-roboto font-medium text-base transition-all duration-200"
                              onClick={() => {}}
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
                      onClick={() => {}}
                    >
                      <span className=" text-[#2f577a] group-hover:text-[#2f577a] font-semibold text-lg ">
                        {item.titleKey}
                      </span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Button className="bg-transparent border border-white hover:bg-white hover:text-black w-[200px] h-[40px] text-md font-montserrat text-white rounded-md font-medium p-0 tracking-widest">
          Button
        </Button>
      </SidebarContent>
    </Sidebar>
  );
}
