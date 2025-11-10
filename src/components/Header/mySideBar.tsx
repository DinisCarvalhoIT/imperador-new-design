import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Header/app-sidebar.tsx";
import type { GetImageResult } from "astro";

export default function MySideBar({}: {}) {
  return (
    <div className="xl:hidden block fixed inset-0 z-50 pointer-events-none">
      <SidebarProvider className="" defaultOpen={false}>
        <AppSidebar />
        <SidebarTrigger className="pointer-events-auto text-white hover:bg-white z-50 cursor-pointer fixed sm:top-7 top-[15px] sm:right-27 right-20" />
      </SidebarProvider>
    </div>
  );
}
