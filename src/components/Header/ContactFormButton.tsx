import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  variant,
}: {
  lang: "en" | "pt";
  classNameButtonStyle: string;
  buttonText: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "contact" | "prices-availability";
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        toast.success(t("contact.toast.success"));
        setIsModalOpen(false);
        form.reset();
      } else {
        toast.error(t("contact.toast.error"));
      }
    } catch (error) {
      toast.error(t("contact.toast.error"));
      console.error("Error submitting form:", error);
    }
  }
  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} className={classNameButtonStyle}>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="bg-[#0B1D26]/94 w-[95vw] max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[900px] border-[#7192A2] text-[#6d847f] overflow-y-auto px-8 py-8 sm:p-8 md:p-12 lg:p-12 max-h-[90vh]">
          <DialogHeader>
            <DialogDescription className="text-center text-xs sm:text-sm text-[#E7C873]  pt-8 font-montserrat font-light">
              {t("contact.dialog_description")}
            </DialogDescription>
            <DialogTitle className="flex justify-center pb-4 sm:pb-5">
              <span className="text-3xl sm:text-5xl xl:text-[34px] text-center text-white font-playfairDisplay font-thin pt-1 leading-tight">
                {t("contact.dialog_title")}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-0">
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-x-3 sm:gap-y-2 items-start w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder={t("contact.name_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[40px] sm:h-[44px] md:h-[48px] text-sm sm:text-base text-black font-montserrat  font-light"
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
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("contact.email_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[40px] sm:h-[44px] md:h-[48px] text-sm sm:text-base text-black font-montserrat  font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:pt-3 w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("contact.message_placeholder")}
                          className="bg-white/84 border border-[#a3a3a0] h-[120px] sm:h-[120px] md:h-[128px] text-sm sm:text-base text-black font-montserrat  font-light resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center sm:mt-3">
                <Button
                  className="text-white text-sm sm:text-base md:text-lg tracking-[0.2em] lg:text-sm bg-[#7192A2] hover:bg-[#7192A2]/80 hover:border-2 w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[48px] sm:h-[48px] md:h-[52px] font-montserrat cursor-pointer"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("contact.submit_button")
                  )}
                </Button>
              </div>
              <img
                src={logoImg}
                alt={t("contact.logo_alt")}
                width={200}
                height={200}
                className="w-[100px] h-[47px] sm:w-[140px] sm:h-[65px] md:w-[160px] md:h-[75px] lg:w-[171px] lg:h-[80px] mx-auto mt-5 sm:mt-8 md:mt-10"
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
