import {
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  Bell,
  Hash,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { MenuLinks } from "@/shared/menu-links";
import { ScrollArea } from "./ui/scroll-area";
import { useNotification } from "@/contexts/NotificationContext";

function SideBar() {
  const storageKey = APP_NAME + "-sidebar-state";
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(
    localStorage.getItem(storageKey) === "closed"
      ? false
      : localStorage.getItem(storageKey) === "open"
        ? true
        : window.innerWidth <= 1200 // sidebar should not be open on screens less than 1200px
          ? false
          : true,
  );

  function saveSideBarState(state: boolean) {
    setIsSideBarOpen(state);
    // save the state of sidebar in local storage
    localStorage.setItem(storageKey, state ? "open" : "closed");
  }

  const { toggleNotification } = useNotification();

  return (
    <aside
      id={isSideBarOpen ? "sidebar-open" : "sidebar-closed"}
      className={`${
        isSideBarOpen
          ? "w-[220px] min-w-[220px] lg:w-[260px] lg:min-w-[260px]"
          : ""
      } z-10 hidden h-screen min-w-14 flex-col border-r bg-background px-6 md:flex`}
    >
      <div className="flex h-14 max-h-14 min-h-14 w-full items-center border-b lg:h-[60px] lg:max-h-[60px] lg:min-h-[60px]">
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 font-semibold outline-none"
        >
          <Hash className="h-7 w-7" />
          {isSideBarOpen && <span className="">{APP_NAME}</span>}
        </Link>
        {isSideBarOpen && (
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={() => toggleNotification()}
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">notifications</span>
          </Button>
        )}
      </div>
      <ScrollArea className="h-full">
        <div className="flex-grow overflow-auto">
          <nav className="flex flex-1 flex-col gap-2 sm:py-5">
            {MenuLinks.filter((link) => link.onlyMobile == false).map(
              (link, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={link.href}
                        className="flex w-full items-center gap-4 rounded-xl py-2 text-muted-foreground outline-none hover:text-foreground [#sidebar-closed_&]:justify-center"
                      >
                        <link.icon className="size-6" />
                        {isSideBarOpen && <span className="">{link.text}</span>}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent
                      className={isSideBarOpen ? "hidden" : ""}
                      side="right"
                    >
                      {link.text}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ),
            )}
          </nav>
        </div>
      </ScrollArea>
      <nav className="flex flex-col items-center gap-2 sm:py-5">
        {!isSideBarOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  onClick={() => {
                    saveSideBarState(!isSideBarOpen);
                  }}
                  to="#"
                  className="flex w-full items-center gap-4 rounded-xl py-2 text-muted-foreground hover:text-foreground"
                >
                  <PanelLeftOpen className="size-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                className={isSideBarOpen ? "hidden" : ""}
                side="right"
              >
                Expand Menu
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex w-full items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={ROUTES.settings.general}
                  className="flex items-center gap-4 rounded-xl py-2 text-muted-foreground outline-none hover:text-foreground"
                >
                  <Settings className="size-6" />
                  {isSideBarOpen && <span className="">Settings</span>}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent
                className={isSideBarOpen ? "hidden" : ""}
                side="right"
              >
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isSideBarOpen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      saveSideBarState(!isSideBarOpen);
                    }}
                    variant="outline"
                    size="icon"
                    className="ml-auto flex h-8 w-8 items-center gap-4 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <PanelLeftClose className="size-6" />
                    <span className="sr-only">Collapse Menu</span>
                  </Button>
                </TooltipTrigger>
                {isSideBarOpen && (
                  <TooltipContent side="right">Collapse Menu</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
