import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  text: string;
}

export default function WhatsAppButton({ text }: WhatsAppButtonProps) {
  return (
    <a
      href="https://wa.me/351965611642"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Button
        variant="contact"
        className="w-[252px] h-[28px] cursor-pointer font-montserrat font-medium text-[11px] leading-[28.5px] tracking-[0.15em] uppercase"
        asChild={false}
      >
        {text}
      </Button>
    </a>
  );
}

