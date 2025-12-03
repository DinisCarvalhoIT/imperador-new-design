import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Header/app-sidebar.tsx";
import type { GetImageResult } from "astro";

interface MySideBarProps {
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

export default function MySideBar({ translations, lang }: MySideBarProps) {
  return (
    <div className="xl:hidden block fixed inset-0 z-50 pointer-events-none">
      <SidebarProvider className="" defaultOpen={false}>
        <AppSidebar translations={translations} lang={lang} />
        <SidebarTrigger className="pointer-events-auto text-white hover:bg-white z-50 cursor-pointer fixed sm:top-7 top-[15px] sm:right-27 right-20 scale-90" />
      </SidebarProvider>
    </div>
  );
}
