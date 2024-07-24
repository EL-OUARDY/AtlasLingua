import { User, Hash } from "lucide-react";
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
import { useUser } from "@/contexts/UserContext";
import authService from "@/services/authService";
import { CanceledError } from "axios";
import { toast } from "sonner";

function Header() {
  const { toggleNotification } = useNotification();
  const { user, setUser } = useUser();

  function logout() {
    const { request } = authService.logout();
    request
      .then(() => {
        setUser(undefined);
        window.location.href = ROUTES.home;
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;

        toast("Can't perform action!", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      })
      .finally(() => {});
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-4 py-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6 md:py-0">
      <MobileSideBar />
      <Button
        onClick={() => toggleNotification()}
        variant="outline"
        size="icon"
        className="overflow-hidden md:hidden md:rounded-full"
      >
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.7}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
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
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden md:rounded-full"
            onClick={() => toggleNotification()}
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>

            <span className="sr-only">notifications</span>
          </Button>
        </div>
        <ThemeSwitch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden md:rounded-full"
            >
              <User className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user && (
              <Link to={ROUTES.settings.profile}>
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
            )}
            <Link to={ROUTES.contact}>
              <DropdownMenuItem className="cursor-pointer">
                Support
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            {!user && (
              <Link to={ROUTES.login}>
                <DropdownMenuItem className="cursor-pointer">
                  Login
                </DropdownMenuItem>
              </Link>
            )}
            {user && (
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Logout
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
