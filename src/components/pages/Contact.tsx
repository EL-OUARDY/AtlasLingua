import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import AuthLayout from "../layouts/AuthLayout";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import contactService, { IContactRequest } from "@/services/contactService";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CanceledError } from "axios";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Please enter a subject!" }),
  message: z.string().min(1, { message: "Please enter your message!" }),
});
function Contact() {
  const { user } = useUser();

  const defaultValue: IContactRequest = user
    ? { name: user.name, email: user.email, subject: "", message: "" }
    : { name: "", email: "", subject: "", message: "" };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContactRequest>({
    defaultValues: defaultValue,
    resolver: zodResolver(contactSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(data: IContactRequest) {
    setIsSubmitting(true);
    const { request } = contactService.contact(data);
    request
      .then(() => {
        toast.success(
          "Your message has been sent successfully! We will reach out to you soon.",
          {
            duration: 10000,
            action: {
              label: "OK",
              onClick: () => {},
            },
          },
        );
        reset(); // clear the form
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast.error(
          "An error has been occured while trying to submit the form! Try again later.",
          {
            action: {
              label: "Hide",
              onClick: () => {},
            },
          },
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const description =
    "We value open communication with our users. Whether you have questions, suggestions, or just want to say hello, we're here to listen. Your input helps us improve our English ⇔ Darija Translator and better serve our community. We aim to respond to all messages promptly, typically within 1-2 business days. Thank you for reaching out!";
  return (
    <AuthLayout description={description}>
      <Card className="mx-auto w-full border-none md:w-[450px]">
        <CardHeader className="text-center">
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll respond as quickly as possible.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Your name"
                autoComplete="on"
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                placeholder="Your email address"
                autoComplete="on"
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                {...register("subject")}
                id="subject"
                placeholder="What's this about?"
                autoComplete="off"
              />
              {errors.subject && (
                <p className="text-sm font-medium text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                {...register("message")}
                id="message"
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="text-sm font-medium text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
            >
              Clear
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default Contact;
