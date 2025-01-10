import { createContext, ReactNode, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckIcon from "@/components/ui/icons/CheckIcon";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUser } from "./UserContext";
import { IReportPost } from "@/models/Community";
import { useCommunity } from "./CommunityContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";

interface IReportPostContext {
  openReportDialog: (postId: string, commentId?: string) => void;
}

const ReportPostContext = createContext<IReportPostContext>(
  {} as IReportPostContext,
);

// custom hook to expose the ReportPostContext
export function useReportPost() {
  return useContext(ReportPostContext);
}

interface Props {
  children: ReactNode;
}

const reportSchema = z.object({
  postId: z.string(),
  commentId: z.string().optional(),
  reasons: z.array(z.string()).min(1, "Please select at least one reason"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const reportReasons = [
  { id: "spam", label: "Spam or misleading" },
  { id: "harassment-hate", label: "Harassment or hate speech" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "copyright", label: "Copyright violation" },
  { id: "personal-info", label: "Personal information" },
  { id: "other", label: "Other" },
] as const;

function ReportPostProvider({ children }: Props) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      postId: "",
      commentId: "",
      reasons: [],
      description: "",
    },
  });

  const { setValue, reset } = form;

  const { user, isAuthenticated } = useUser();
  const { reportPost } = useCommunity();

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  function openReportDialog(postId: string, commentId: string = "") {
    if (!user || !isAuthenticated) loginFirst();
    setHasSubmitted(false);
    reset();
    setValue("postId", postId);
    setValue("commentId", commentId);
    setIsReportOpen(true);
  }

  async function handleSubmit(data: ReportFormValues) {
    try {
      setIsSubmitting(true);
      const newReport: IReportPost = {
        ...data,
        userId: user?.id,
      };
      await reportPost(newReport);
      setHasSubmitted(true);
      form.reset();
    } catch (error) {
      toast("There was an error submitting your report. Please try again.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(
      APP_NAME + "-return-url",
      location.pathname + location.search,
    );
    // navigate to login
    navigate(ROUTES.login);
  }

  return (
    <ReportPostContext.Provider
      value={{
        openReportDialog,
      }}
    >
      {children}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="w-11/12 rounded-lg sm:w-[450px]">
          <DialogHeader>
            {!hasSubmitted && (
              <>
                <DialogTitle className="text-2xl">Report</DialogTitle>
                <DialogDescription>
                  Please provide details about why you're reporting this post.
                  Your report will be reviewed by our moderators.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <div className="grid gap-4">
            {!hasSubmitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="">
                  <FormField
                    control={form.control}
                    name="postId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="hidden" disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} type="hidden" disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reasons"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Reason for reporting
                        </FormLabel>
                        <div className="grid gap-2">
                          {reportReasons.map((reason) => (
                            <FormField
                              key={reason.id}
                              control={form.control}
                              name="reasons"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(reason.id)}
                                      onCheckedChange={(checked) => {
                                        const value = field.value || [];
                                        if (checked) {
                                          field.onChange([...value, reason.id]);
                                        } else {
                                          field.onChange(
                                            value.filter(
                                              (v) => v !== reason.id,
                                            ),
                                          );
                                        }
                                      }}
                                      tabIndex={-1}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer font-normal text-muted-foreground">
                                    {reason.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="my-4">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Please provide more details about your report..."
                            className="resize-none"
                            tabIndex={-1}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      className="ml-auto max-w-fit"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            ) : (
              <div className="grid gap-2">
                <div className="flex justify-center p-4 opacity-70">
                  <CheckIcon className="size-20" color="#16a34a" />
                </div>
                <p className="text-muted-foreground">
                  Thank you for helping keep our community safe. Our moderators
                  will review your report.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ReportPostContext.Provider>
  );
}

export default ReportPostProvider;
