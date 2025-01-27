import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { AxiosError, CanceledError } from "axios";
import { toast } from "sonner";
import authService from "@/services/authService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z.string().max(255).optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

type ProfileFormValues = z.infer<typeof FormSchema>;

function ProfileSettings() {
  const { user, updateUserProfile } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  const defaultValues: ProfileFormValues = {
    name: "",
    email: "",
    bio: "",
    password: "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const { setValue, reset, formState } = form;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        bio: user.bio,
        password: "",
      });
    }
  }, [reset, setValue, user]);

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    const { request } = authService.updateUser(data);
    request
      .then(() => {
        // Update user
        updateUserProfile(data);
        reset();
        toast.error("Profile updated successfully", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
        reset(data);
      })
      .catch((err: AxiosError) => {
        if (err instanceof CanceledError) return;
        const message = (err.response?.data as { message?: string })?.message;
        toast.error(
          message || "Something went wrong. Your profile couldn't be saved!",
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
    localStorage.setItem(APP_NAME + "-return-url", ROUTES.settings.profile);
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
              Please log in to edit your profile.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p>
          </div>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4 sm:w-[360px] md:w-[480px]"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={APP_NAME}
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name
                      or a pseudonym.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`user@${APP_NAME.toLowerCase()}.com`}
                        autoComplete="on"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This where you'll receive notifications form us.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion
                type="single"
                collapsible
                className="w-full"
                onValueChange={() => setValue("password", "")}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="pt-0 text-sm">
                    Change Password
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-1">
                              <Input
                                className="no-ring"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Enter your new password"
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() =>
                                  setIsPasswordShown(!isPasswordShown)
                                }
                              >
                                {isPasswordShown ? (
                                  <EyeOffIcon className="size-4 text-muted-foreground" />
                                ) : (
                                  <EyeIcon className="size-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter a strong password that you haven't used
                            before.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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
                  "Save changes"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}

export default ProfileSettings;
