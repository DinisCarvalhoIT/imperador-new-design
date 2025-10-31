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

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
});

export default function ContactFormButton({
  lang,
  classNameButtonStyle,
  buttonText,
}: {
  lang: "en" | "pt";
  classNameButtonStyle: string;
  buttonText: string;
}) {
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
        <DialogContent className=" bg-white md:min-w-[700px] max-w-lg w-full border-[#202d18] text-[#6d847f] overflow-y-auto max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <span className="sm:text-4xl text-xl text-center text-[#6d847f] font-playfairDisplay ">
                {"translations.dialogTitle"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-[#6d847f] mt-2">
              Fill out this form to get in touch with us. We'll respond as soon
              as possible.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 items-center md:py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sm:text-lg font-montserrat text-base italic">
                        {"translations.nameLabel"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"translations.namePlaceholder"}
                          className="bg-white border border-[#a3a3a0] sm:text-base text-black"
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
                      <FormLabel className="sm:text-lg font-montserrat text-base italic">
                        {"translations.emailLabel"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={"translations.emailPlaceholder"}
                          className="bg-white border border-[#a3a3a0] sm:text-base text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:py-2 relative">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sm:text-lg font-montserrat text-base italic">
                        {"translations.messageLabel"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={"translations.messagePlaceholder"}
                          className="bg-white border border-[#a3a3a0] sm:text-base text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="mx-auto text-[#6d847f] sm:text-xl text-base bg-[#f0f2f1] hover:bg-transparent hover:border-2  sm:w-1/2 w-1/3 sm:mt-4 mt-3 font-montserrat italic font-semibold cursor-pointer"
                type="submit"
              >
                translations.loadingButton
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
