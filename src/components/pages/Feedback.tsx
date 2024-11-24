import feedbackService, { IFeedbackRequest } from "@/services/feedbackService";
import { zodResolver } from "@hookform/resolvers/zod";
import { CanceledError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "../ui/separator";
import { Hash, Loader2 } from "lucide-react";
import { APP_NAME } from "@/shared/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useUser } from "@/contexts/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const feedbackSchema = z.object({
  subject: z.string().min(1, { message: "Subject field is required!" }),
  body: z.string().min(1, { message: "Please enter your feedback!" }),
});

function Feedback() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFeedbackRequest>({
    defaultValues: { subject: "", body: "" },
    resolver: zodResolver(feedbackSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function onSubmit(data: IFeedbackRequest) {
    if (!user) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);
    const { request } = feedbackService.submitFeedback(data);
    request
      .then(() => {
        reset(); // clear the form
        setIsSubmitted(true);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast.error(
          "An error has been occured while trying to submit your feedback!",
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

  function loginFirst() {
    // save return url
    localStorage.setItem(APP_NAME + "-return-url", location.pathname);
    // navigate to login
    navigate(ROUTES.login);
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-start shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="w-full p-4 sm:p-0">
        <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
        <p className="mt-1 text-muted-foreground">
          Share Your Thoughts: Help Us Improve.
        </p>
      </div>
      <Separator className="my-6 hidden sm:block" />
      <div className="grid h-full w-full gap-8 rounded-lg p-4 sm:bg-background sm:p-6 md:gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Share Your Feedback
            </CardTitle>
            <CardDescription>
              What aspect of the app would you like to comment on?
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
                  Thank you for your feedback! We appreciate your input and are
                  always striving to improve. If you have any more thoughts or
                  suggestions, feel free to share!
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    {...register("subject")}
                    id="subject"
                    placeholder="Enter feedback subject"
                    autoComplete="off"
                  />
                  {errors.subject && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body">Feedback</Label>
                  <Textarea
                    {...register("body")}
                    id="body"
                    placeholder="Please include all information relevant to your feedback."
                  />
                  {errors.body && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.body.message}
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
                    "Submit"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
        <div className="h-full">
          <div className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
            <Hash className="h-6 w-6" />
            <div className="mb-2 mt-4 text-lg font-medium">{APP_NAME}</div>
            <p className="leading-tight text-muted-foreground">
              Feedback is vital to the growth and improvement of our translator.
              Your insights help us refine our translations, enhance user
              experience, and add features that matter most to you. As language
              is dynamic and nuanced, your input ensures our app stays accurate
              and relevant. Whether you're a native Darija speaker, an English
              learner, or somewhere in between, your perspective is invaluable.
              By sharing your thoughts, you're not just helping us – you're
              contributing to a community resource that bridges cultures and
              facilitates communication. Every comment, suggestion, or report
              you provide plays a crucial role in making this tool more
              effective for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
