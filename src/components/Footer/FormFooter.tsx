import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ui } from "../../i18n/ui";

type Props = {
  lang: keyof typeof ui;
};

export default function FormFooter({ lang }: Props) {
  const t = ui[lang];

  const formSchema = z.object({
    name: z
      .string()
      .min(1, t["footer.form.validation.name_required"])
      .max(50, t["footer.form.validation.name_max"]),
    email: z.string().email(t["footer.form.validation.email_invalid"]),
    message: z
      .string()
      .min(1, t["footer.form.validation.message_required"])
      .max(500, t["footer.form.validation.message_max"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full 2xl:max-w-[70%] lg:max-w-full md:max-w-[60%] sm:max-w-[80%] max-w-[90%]"
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 w-full items-center gap-x-3 pb-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="bg-white/84 border border-[#a3a3a0] text-sm text-black font-montserrat tracking-widest font-light lg:mb-0 mb-3 w-full"
                    placeholder={t["footer.form.name_placeholder"]}
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
                    className="bg-white/84 border border-[#a3a3a0] text-sm text-black font-montserrat tracking-widest font-light w-full"
                    type="email"
                    placeholder={t["footer.form.email_placeholder"]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  className="bg-white/84 border border-[#a3a3a0] h-[90px] text-sm text-black font-montserrat tracking-widest font-light resize-none w-full"
                  placeholder={t["footer.form.message_placeholder"]}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center mt-3">
          <Button
            className="text-white text-base bg-[#7192A2] hover:bg-[#7192A2]/80 hover:border-2 w-full font-montserrat font-semibold cursor-pointer"
            type="submit"
          >
            {t["footer.form.submit_button"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
