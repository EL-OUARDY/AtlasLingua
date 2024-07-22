import { APP_NAME } from "@/shared/constants";
import { Hash, Loader2 } from "lucide-react";
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
import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import contributionService, {
  IContributionRequest,
} from "@/services/contributionService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CanceledError } from "axios";

const contributionSchema = z.object({
  contribution_type: z.string().min(1, { message: "Field is required!" }),
  description: z
    .string()
    .min(1, { message: "Please enter a description for your contribution!" }),
  links: z.string(),
});

function Contribution() {
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

  function onSubmit(credentials: IContributionRequest) {
    setIsSubmitting(true);

    const { request } = contributionService.submitContribution(credentials);
    request
      .then(() => {
        toast.success("Contribution has been made successfully! Thank you.");
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

  return (
    <>
      <div className="flex h-full flex-1 flex-col items-center justify-start shadow-sm">
        {/* <div className="w-full">
          <h2 className="text-2xl font-bold tracking-tight">Contribution</h2>
          <p className="mt-1 text-muted-foreground">
            Help us bridge languages. Your input is invaluable.
          </p>
        </div>
        <Separator className="my-6" /> */}
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
                  to={"#"}
                >
                  Contribution Guide
                </Link>{" "}
                before submitting. Every contribution must align with our
                guidelines to be considered. Together, we can create a more
                comprehensive and accurate translation resource.
              </p>
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
                    <small className="text-muted-foreground">(optional)</small>
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
          </Card>
        </div>
      </div>
    </>
  );
}

export default Contribution;
