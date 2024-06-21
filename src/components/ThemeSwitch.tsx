import { MoonStar, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-provider";
import { useEffect, useState } from "react";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [currTheme, setCurrTheme] = useState<string>();

  useEffect(() => {
    if (theme === "system") {
      setCurrTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
      return;
    }
    setCurrTheme(theme.toString());
  }, [theme, setCurrTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden md:rounded-full hidden md:flex "
        >
          {currTheme === "light" && (
            <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          )}
          {currTheme === "dark" && (
            <MoonStar className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          direction="right"
          checked={theme === "light"}
          onClick={() => setTheme("light")}
          className=" cursor-pointer"
        >
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          direction="right"
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
          className=" cursor-pointer"
        >
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          direction="right"
          checked={theme === "system"}
          onClick={() => setTheme("system")}
          className=" cursor-pointer"
        >
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitch;
