import {
  APP_EMAIL,
  APP_GITHUB,
  APP_NAME,
  APP_TWITTER,
} from "@/shared/constants";
import {
  GithubIcon,
  Hash,
  Loader2,
  MailIcon,
  TerminalIcon,
  TwitterIcon,
} from "lucide-react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import contributionService, {
  IContributionRequest,
} from "@/services/contributionService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CanceledError } from "axios";
import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/routes/routes";

const contributionSchema = z.object({
  contribution_type: z.string().min(1, { message: "Field is required!" }),
  description: z
    .string()
    .min(1, { message: "Please enter a description for your contribution!" }),
  links: z.string(),
});

function Contribution() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContributionRequest>({
    defaultValues: { contribution_type: "", description: "", links: "" },
    resolver: zodResolver(contributionSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function onSubmit(data: IContributionRequest) {
    if (!user) {
      loginFirst();
      return;
    }
    setIsSubmitting(true);

    const { request } = contributionService.submitContribution(data);
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
    <>
      <div className="flex h-full flex-1 flex-col items-center justify-start shadow-sm">
        <div className="grid h-full w-full flex-1 gap-8 rounded-lg p-4 sm:p-6 md:gap-4 md:bg-background xl:grid-cols-[1fr_1fr]">
          <div className="h-full">
            <div className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-background/50 to-background p-6 no-underline outline-none focus:shadow-md dark:from-muted/50 dark:to-muted md:from-muted/50 md:to-muted">
              <Hash className="h-6 w-6" />
              <div className="mb-2 mt-4 text-lg font-medium">{APP_NAME}</div>
              <p className="leading-tight text-muted-foreground">
                Contributions are crucial to the success and growth of our
                translator. Whether you're offering translations, datasets,
                feature ideas, or other valuable input, your efforts help
                enhance our tool for everyone. <br /> We welcome contributions
                in various forms, including documents and spreadsheets. <br />
                To ensure quality and consistency, please read our{" "}
                <Link
                  className="text-secondary-foreground hover:underline"
                  to={ROUTES.contribution_guidelines}
                >
                  Contribution Guide
                </Link>{" "}
                before submitting. Every contribution must align with our
                guidelines to be considered. Together, we can create a more
                comprehensive and accurate translation resource.
              </p>
              <Card className="mt-4">
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle>
                      <div className="flex items-center gap-1">
                        <TerminalIcon className="size-5" />
                        <p className="text-base">Developers</p>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      This project is open source, and we welcome your
                      contributions! Feel free to reach out for more information
                      on how to get started.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <a
                      href={APP_GITHUB}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-sky-400"
                    >
                      <GithubIcon className="mr-1 size-4 text-sky-400" />
                      Github
                    </a>
                    <a
                      href={APP_TWITTER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-sky-400"
                    >
                      <TwitterIcon className="mr-1 size-4 text-sky-400" />
                      Twitter
                    </a>
                    <a
                      href={`mailto:${APP_EMAIL}`}
                      className="flex items-center hover:text-sky-400"
                    >
                      <MailIcon className="mr-1 size-4 text-sky-400" />
                      Contact
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Contribute to Our Project
              </CardTitle>
              <CardDescription>
                Join our mission to improve language learning. Contribute now!
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
                    Thank you for your contribution! We appreciate your help in
                    enhancing our translations. Your input is invaluable in
                    making the app better for everyone. If you have more
                    suggestions, don’t hesitate to share!
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Contribution Type</Label>
                    <Input
                      {...register("contribution_type")}
                      id="contribution_type"
                      placeholder="e.g., Translation, Dataset, Feature Idea"
                      autoComplete="off"
                    />
                    {errors.contribution_type && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.contribution_type.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="body">Description</Label>
                    <Textarea
                      {...register("description")}
                      id="description"
                      placeholder="Briefly describe your contribution"
                    />
                    {errors.description && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="links">
                      Links{" "}
                      <small className="text-muted-foreground">
                        (optional)
                      </small>
                    </Label>
                    <Textarea
                      {...register("links")}
                      id="links"
                      className="placeholder:text-xs placeholder:text-muted-foreground/50"
                      placeholder="https://docs.google.com/spreadsheets/d/&#13;&#10;https://mega.nz/file/&#13;&#10;https://drive.google.com/file/d/"
                    />
                    {errors.links && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.links.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      You can include links from Google Drive, Google Sheets, or
                      any other file hosting service.
                    </p>
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
                      "Contribute"
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default Contribution;
