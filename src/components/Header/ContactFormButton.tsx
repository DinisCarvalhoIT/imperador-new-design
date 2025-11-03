import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import logoImg from "/HomePage/logoImperador.svg?url";
import { ui } from "@/i18n/ui";

const getFormSchema = (lang: "en" | "pt") => {
  const t = (key: keyof typeof ui.en) => ui[lang][key] || ui.en[key];

  return z.object({
    name: z
      .string()
      .min(1, t("contact.validation.name_required"))
      .max(50, t("contact.validation.name_max")),
    email: z.string().email(t("contact.validation.email_invalid")),
    message: z
      .string()
      .min(1, t("contact.validation.message_required"))
      .max(500, t("contact.validation.message_max")),
  });
};

export default function ContactFormButton({
  lang,
  classNameButtonStyle,
  buttonText,
}: {
  lang: "en" | "pt";
  classNameButtonStyle: string;
  buttonText: string;
}) {
  const formSchema = getFormSchema(lang);
  const t = (key: keyof typeof ui.en) => ui[lang][key] || ui.en[key];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className={classNameButtonStyle}>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0B1D26]/94 w-[95vw] max-w-[600px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[900px] border-[#7192A2] text-[#6d847f] overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12 max-h-[90vh]">
          <DialogHeader>
            <DialogDescription className="text-center text-xs sm:text-sm md:text-[15px] text-[#E7C873] tracking-widest font-montserrat font-light">
              {t("contact.dialog_description")}
            </DialogDescription>
            <DialogTitle className="flex justify-center">
              <span className="text-lg sm:text-2xl md:text-3xl lg:text-[54px] text-center text-white font-playfairDisplay font-thin leading-tight">
                {t("contact.dialog_title")}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-2 sm:gap-x-3 gap-y-3 sm:gap-y-4 items-start pb-2 sm:pb-3 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t("contact.name_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[40px] sm:h-[44px] md:h-[48px] text-sm sm:text-base text-black font-montserrat tracking-widest font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("contact.email_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[40px] sm:h-[44px] md:h-[48px] text-sm sm:text-base text-black font-montserrat tracking-widest font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2 sm:pt-3 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("contact.message_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[100px] sm:h-[120px] md:h-[128px] text-sm sm:text-base text-black font-montserrat tracking-widest font-light resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button
                  className="text-white text-sm sm:text-base md:text-lg lg:text-xl bg-[#7192A2] hover:bg-[#7192A2]/80 hover:border-2 w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[44px] sm:h-[48px] md:h-[52px] font-montserrat font-semibold cursor-pointer"
                  type="submit"
                >
                  {t("contact.submit_button")}
                </Button>
              </div>
              <img
                src={logoImg}
                alt={t("contact.logo_alt")}
                width={200}
                height={200}
                className="w-[120px] h-[56px] sm:w-[140px] sm:h-[65px] md:w-[160px] md:h-[75px] lg:w-[171px] lg:h-[80px] mx-auto mt-6 sm:mt-8 md:mt-10"
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
