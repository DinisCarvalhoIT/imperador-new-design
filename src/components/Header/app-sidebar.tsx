"use client";
import {
  DoorClosed,
  LogOut,
  NotebookPen,
  PhoneForwarded,
  MapPinned,
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

const items = [
  {
    titleKey: "Quartos",
    icon: DoorClosed,
    scrollID: "rooms",
  },
  {
    titleKey: "Atividades",
    icon: NotebookPen,
    scrollID: "attractions",
  },
  {
    titleKey: "Localização",
    icon: MapPinned,
    scrollID: "map",
  },
  {
    titleKey: "Contactos",
    icon: PhoneForwarded,
    scrollID: "contact",
  },
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-slate-200">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem className="relative flex items-center p-5">
            <div className="flex-1 flex justify-center">
              <span className="font-playfair text-3xl text-[#2f577a] font-semibold">
                Menu
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    className="group relative h-12 px-4 rounded-lg transition-all duration-200 hover:bg-[#2f577a]/10 hover:shadow-sm font-roboto gap-3"
                    onClick={() => {}}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-slate-100  ">
                      <item.icon className="w-5 h-5 text-[#2f577a] " />
                    </div>
                    <span className=" text-[#2f577a] group-hover:text-[#2f577a] font-semibold text-lg ">
                      {item.titleKey}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
