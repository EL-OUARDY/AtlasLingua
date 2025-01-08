import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Flag, Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import reportService, { IReportRequest } from "@/services/reportService";
import { toast } from "sonner";
import { CanceledError } from "axios";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useUser } from "@/contexts/UserContext";
import { APP_NAME } from "@/shared/constants";
import WTooltip from "./ui/custom/WTooltip";
import CheckIcon from "./ui/icons/CheckIcon";

interface Props {
  translation: string;
  translationId?: number;
}

const reportSchema = z.object({
  body: z.string().min(1, { message: "Field is required!" }),
});

function ReportDialog({ translation, translationId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IReportRequest>({
    defaultValues: { body: "" },
    resolver: zodResolver(reportSchema),
  });

  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const submitted = localStorage.getItem(APP_NAME + "-report-submitted");
    if (submitted && submitted == translationId?.toString())
      setHasSubmitted(true);
  }, [translationId]);

  function onSubmit(data: IReportRequest) {
    data.translation_id = translationId;
    setIsSubmitting(true);
    const { request } = reportService.submitReport(data);
    request
      .then(() => {
        setHasSubmitted(true);
        localStorage.setItem(
          APP_NAME + "-report-submitted",
          (translationId as number).toString(),
        );
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast.error(
          "Something went wrong. Your report couldn't be submitted!",
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
      <WTooltip side="top" content="Report Translation">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-background/60 dark:hover:bg-background/30"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Flag className="size-5 text-muted-foreground" />
          <span className="sr-only">Report Translation</span>
        </Button>
      </WTooltip>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-11/12 rounded-lg sm:w-[450px]">
          <DialogHeader>
            {!hasSubmitted && (
              <>
                <DialogTitle className="text-2xl">Report</DialogTitle>
                <DialogDescription>
                  Contribute to better translations: Report issues here
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <div className="grid gap-4">
            {!hasSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <Label>Translation</Label>
                  <Textarea
                    readOnly
                    value={translation}
                    className="mb-2 italic text-muted-foreground first-word-cap no-ring"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body">Your comment</Label>
                  <Textarea
                    id="body"
                    {...register("body")}
                    placeholder="Describe the issue you've encountered or enter your suggested correction/improvement."
                  />
                  {errors.body && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.body.message}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {!user && (
                    <div className="text-muted-foreground">
                      Please{" "}
                      <Link
                        to={ROUTES.login}
                        className="underline hover:text-foreground"
                      >
                        login
                      </Link>{" "}
                      first
                    </div>
                  )}
                  <Button
                    disabled={isSubmitting || !user}
                    type="submit"
                    className="ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                        wait
                      </>
                    ) : (
                      "Report Translation"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-2">
                <div className="flex justify-center p-4 opacity-70">
                  <CheckIcon className="size-20" color="#16a34a" />
                </div>
                <p className="text-muted-foreground">
                  Thank you! Your report has been successfully submitted. We'll
                  review it shortly to improve the translation quality.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReportDialog;
