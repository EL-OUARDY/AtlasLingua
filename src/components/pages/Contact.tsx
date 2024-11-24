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
  const [isSubmitted, setIsSubmitted] = useState(false);

  function onSubmit(data: IContactRequest) {
    setIsSubmitting(true);
    const { request } = contactService.contact(data);
    request
      .then(() => {
        reset(); // clear the form
        setIsSubmitted(true);
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
        {isSubmitted ? (
          <div className="p-6 pt-0">
            <div
              className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700 dark:bg-muted/50"
              role="alert"
            >
              <svg
                className="mr-1 inline size-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                version="1.1"
              >
                <path
                  d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"
                  fill="#16a34a"
                />
                <path
                  d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z"
                  fill="#16a34a"
                />
              </svg>
              <span>
                Your message has been sent successfully! Thank you for reaching
                out to us. We will carefully review your inquiry and get back to
                you shortly.
              </span>
            </div>
          </div>
        ) : (
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}

export default Contact;
