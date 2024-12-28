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

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(255).optional(),
});

type ProfileFormValues = z.infer<typeof FormSchema>;

function ProfileSettings() {
  const { user } = useUser();
  const navigate = useNavigate();

  // from database
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || "",
    bio: user?.bio || "",
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
            <p className="">Please log in to edit your profile.</p>
            <Button
              variant={"outline"}
              className="w-full max-w-48"
              onClick={loginFirst}
            >
              Login
            </Button>
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
                        placeholder="AtlasLingua"
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
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  disabled
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="user@atlaslingua.com"
                  value={user?.email}
                />
                <p
                  id=":r1rr:-form-item-description"
                  className="text-sm text-muted-foreground"
                >
                  This where you'll receive notifications form us.
                </p>
              </div>
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
              <Button type="submit" className="w-fit">
                Save changes
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
}

export default ProfileSettings;
