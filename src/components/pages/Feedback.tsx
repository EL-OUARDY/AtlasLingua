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

const feedSchema = z.object({
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
    resolver: zodResolver(feedSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(data: IFeedbackRequest) {
    if (!user) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);
    const { request } = feedbackService.submitFeedback(data);
    request
      .then(() => {
        toast.success("Feedback has been sent successfully!", {
          action: {
            label: "OK",
            onClick: () => {},
          },
        });
        reset(); // clear the form
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
      <div className="grid h-full w-full gap-8 rounded-lg bg-background p-4 sm:p-6 md:gap-4 xl:grid-cols-[1fr_1fr]">
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
        <Card className="flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Share Your Feedback
            </CardTitle>
            <CardDescription>
              What aspect of the app would you like to comment on?
            </CardDescription>
          </CardHeader>
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
        </Card>
      </div>
    </div>
  );
}

export default Feedback;
