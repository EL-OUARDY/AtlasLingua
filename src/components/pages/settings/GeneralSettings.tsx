"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

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
import { MenuLinks } from "@/shared/menu-links";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  show_arabic: z.boolean().default(true).optional(),
  sanitize_output: z.boolean().default(true).optional(),
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

// from database
const defaultValues: Partial<FormValues> = {
  show_arabic: true,
  sanitize_output: false,
  items: MenuLinks.map((x) => x.text),
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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="show_arabic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show arabic</FormLabel>
                      <FormDescription>
                        Display translation with arabic letters along side with
                        the Darija one.
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Navigation sidebar
                  </FormLabel>
                  <FormDescription>
                    Select the items you want to display in the sidebar.
                  </FormDescription>
                </div>
                {MenuLinks.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={index}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.text)}
                              name={item.text}
                              disabled={
                                ["Translator", "Dictionary"].includes(item.text)
                                  ? true
                                  : false
                              }
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.text])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.text,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.text}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update display</Button>
        </form>
      </Form>
    </>
  );
}

export default GeneralSettings;
