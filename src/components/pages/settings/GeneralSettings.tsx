import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  show_arabic: z.boolean().default(true).optional(),
  sanitize_output: z.boolean().default(true).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

// from database
const defaultValues: Partial<FormValues> = {
  show_arabic: true,
  sanitize_output: false,
};

function GeneralSettings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Take control of your application's behaviour.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <div className="mb-4">
              <FormLabel className="text-base">Translator</FormLabel>
              <FormDescription>
                Select the default settings for your translation tool.
              </FormDescription>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
              <FormField
                control={form.control}
                name="show_arabic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show arabic</FormLabel>
                      <FormDescription>
                        Display translation with arabic letters along side with
                        the Darija translation.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name={field.name}
                        className="ml-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sanitize_output"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Sanitize the output
                      </FormLabel>
                      <FormDescription>
                        Make translations easy to read by replacing confusing
                        characters. <br /> <i>{"Example: ch => sh"}</i>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name={field.name}
                        className="ml-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </>
  );
}

export default GeneralSettings;
