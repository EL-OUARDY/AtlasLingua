import { User, Hash, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "react-router-dom";
import MobileSideBar from "./MobileSideBar";
import MainMenu from "./MainMenu";
import { APP_NAME } from "@/shared/constants";
import ThemeSwitch from "./ThemeSwitch";
import { useNotification } from "@/contexts/NotificationContext";
import { ROUTES } from "@/routes/routes";

function Header() {
  const { toggleNotification } = useNotification();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-4 py-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6 md:py-0">
      <MobileSideBar />
      <Button
        onClick={() => toggleNotification()}
        variant="outline"
        size="icon"
        className="overflow-hidden md:hidden md:rounded-full"
      >
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <MainMenu className="hidden md:block" />

      <div className="m-auto flex items-center md:hidden">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Hash className="h-6 w-6" />
          <span className="hidden sm:block">{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex gap-2 md:ml-auto">
        <ThemeSwitch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden md:rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={ROUTES.settings.profile}>
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to={ROUTES.contact}>
              <DropdownMenuItem className="cursor-pointer">
                Support
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
