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

function Header() {
  const { toggleNotification } = useNotification();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileSideBar />
      <Button
        onClick={() => toggleNotification()}
        variant="outline"
        size="icon"
        className="overflow-hidden md:rounded-full sm:hidden"
      >
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <MainMenu className="hidden md:block" />

      <div className="flex items-center m-auto sm:hidden">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Hash className="h-6 w-6" />
          <span className="">{APP_NAME}</span>
        </Link>
      </div>
      <div className="sm:ml-auto flex gap-2">
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
            <DropdownMenuItem className=" cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className=" cursor-pointer">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className=" cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
