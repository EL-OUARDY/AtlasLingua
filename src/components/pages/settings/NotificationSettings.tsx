import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/routes/routes";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/shared/constants";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import communityService from "@/services/communityService";
import { toast } from "sonner";

const FormSchema = z.object({
  notificationScope: z.enum(["all", "community", "none"], {
    required_error: "You need to select a notification type.",
  }),
  privacy: z
    .literal(true, {
      errorMap: () => ({ message: "You must agree to our privacy policy" }),
    })
    .default(true),
  communication_emails: z.boolean().default(true).optional(),
  update_emails: z.boolean().default(true).optional(),
});

type NotificationsFormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<NotificationsFormValues> = {
  notificationScope: "all",
  communication_emails: true,
  update_emails: true,
  privacy: true,
};

function NotificationSettings() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const { formState, setValue, reset } = form;

  useEffect(() => {
    if (user) {
      const result = communityService.getNotificationSettings(
        user.id as number,
      );
      result.then((data) => {
        if (!data) return;
        reset({
          notificationScope: data.notificationScope || "all",
          communication_emails: data.communication_emails ?? true,
          update_emails: data.update_emails ?? true,
          privacy: true,
        });
      });
    }
  }, [reset, setValue, user]);

  async function onSubmit(data: NotificationsFormValues) {
    const { privacy, ...settings } = data;
    if (user && privacy) {
      try {
        setIsSubmitting(true);
        await communityService.saveNotificationSettings(
          settings,
          user.id as number,
        );
        toast.error("Updated successfully", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
        reset(data);
      } catch (error) {
        toast.error("Something went wrong. Your settings couldn't be saved!", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(
      APP_NAME + "-return-url",
      ROUTES.settings.notifications,
    );
    // navigate to login
    navigate(ROUTES.login);
  }
  return (
    <>
      {!user ? (
        <div className="flex size-full items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4">
            <Button
              variant={"outline"}
              className="w-full max-w-48"
              onClick={loginFirst}
            >
              Login
            </Button>
            <p className="text-sm text-muted-foreground">
              Log in to update your notification preferences.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Configure how you receive notifications.
            </p>
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="notificationScope"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Notify me about...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        name={field.name}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            All notifications
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="community" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Community replies and mentions
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="none" />
                          </FormControl>
                          <FormLabel className="font-normal">Nothing</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="lg:w-4/5">
                <h4 className="mb-4 text-lg font-medium">
                  Other Notifications
                </h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="communication_emails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Communication emails
                          </FormLabel>
                          <FormDescription>
                            Receive emails about your account activity.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name={field.name}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="update_emails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Update emails
                          </FormLabel>
                          <FormDescription>
                            Receive emails about new products, features, and
                            more.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            name={field.name}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name={field.name}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I have read and agree to the privacy policy
                      </FormLabel>
                      <FormDescription>
                        Review our{" "}
                        <Link to={ROUTES.privacy}>
                          <u>
                            <i>Privacy Policy</i>
                          </u>
                        </Link>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting || !formState.isDirty}
                type="submit"
                className="ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Update notifications"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}

export default NotificationSettings;
