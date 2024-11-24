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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 1024"
                    className="size-20"
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
