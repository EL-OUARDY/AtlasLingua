import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useTheme, Theme, Font } from "@/contexts/ThemeContext";

interface AppearanceFormValues {
  theme: Theme;
  font: Font;
}

function AppearanceSettings() {
  const { theme, font, setTheme, setFont } = useTheme();
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme,
    font: font,
  };
  const form = useForm<AppearanceFormValues>({
    defaultValues,
  });

  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <div className="relative w-max">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFont(value as Font);
                    }}
                    defaultValue={field.value}
                    name={field.name}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="geist">Geist</SelectItem>
                        <SelectItem value="system">System Font</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription>
                  Set the font you want to use in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <span>Theme</span>
                <FormDescription>
                  Select your prefered theme for the dashboard.
                </FormDescription>
                <FormMessage />
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      setTheme(value as Theme);
                      field.onChange(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                    name={field.name}
                    className="grid max-w-md grid-cols-2 gap-8 pt-2"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-2 w-1/2 rounded-lg bg-[#ecedef]" />
                              <div className="h-2 w-3/4 rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-3/4 rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-3/4 rounded-lg bg-[#ecedef]" />
                            </div>
                          </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">
                          Day
                        </span>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-2 w-1/2 rounded-lg bg-slate-400" />
                              <div className="h-2 w-3/4 rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-3/4 rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-3/4 rounded-lg bg-slate-400" />
                            </div>
                          </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">
                          Night
                        </span>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

export default AppearanceSettings;
