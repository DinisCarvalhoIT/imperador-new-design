"use client";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/shadcn-io/marquee";
import Santos from "/Footer/saltos.svg?url";
import MieleIcon from "/Footer/miele.svg?url";
import KrionLogo from "/Footer/Krion.svg?url";
import Lg from "/Footer/LG.svg?url";
import Dekton from "/Footer/Dekton.svg?url";
import Sapa from "/Footer/sapa.svg?url";
import Bticino from "/Footer/Bticino.svg?url";
import Legrand from "/Footer/Legrand.svg?url";

export default function SponsorsMarquee() {
  const sponsors = [
    { name: "Santos", icon: Santos, url: "https://santos.es" },
    { name: "Miele", icon: MieleIcon, url: "https://www.miele.pt" },
    { name: "Krion", icon: KrionLogo, url: "https://www.krion.com" },
    { name: "LG", icon: Lg, url: "https://www.lg.com" },
    { name: "Dekton", icon: Dekton, url: "https://www.cosentino.com/dekton/" },
    { name: "Sapa", icon: Sapa, url: "https://www.sapabuildingsystem.com" },
    { name: "Bticino", icon: Bticino, url: "https://www.bticino.com" },
    { name: "Legrand", icon: Legrand, url: "https://www.legrand.pt" },
  ];

  return (
    <div className="flex items-center justify-center bg-[#0A2532] h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px]">
      <Marquee>
        {/* <MarqueeFade side="left" /> */}
        {/* <MarqueeFade side="right" /> */}
        <MarqueeContent pauseOnHover={false}>
          {sponsors.map((sponsor, index) => (
            <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
              <MarqueeItem
                className={
                  sponsor.name === "Sapa"
                    ? "w-[60px] h-[30px] sm:w-[75px] sm:h-[37px] md:w-[90px] md:h-[41px] lg:w-[98px] lg:h-[45px] mx-8 sm:mx-12 md:mx-16 lg:mx-20 translate-y-0.5"
                    : "w-[80px] h-[40px] sm:w-[100px] sm:h-[49px] md:w-[120px] md:h-[54px] lg:w-[130px] lg:h-[60px] mx-8 sm:mx-12 md:mx-16 lg:mx-20"
                }
                key={index}
              >
                <img
                  alt={sponsor.name}
                  className="overflow-hidden object-contain w-full h-full"
                  src={sponsor.icon}
                />
              </MarqueeItem>
            </a>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
