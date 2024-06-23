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

function SideBar() {
  const storageKey = APP_NAME + "-sidebar-state";
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(
    localStorage.getItem(storageKey) === "closed" ? false : true
  );

  function saveSideBarState(state: boolean) {
    // save the state of sidebar in local storage
    localStorage.setItem(storageKey, state ? "open" : "closed");
  }

  return (
    <aside
      className={`${
        isSideBarOpen ? "md:w-[220px] lg:w-[260px]" : ""
      } z-10 hidden min-w-14 flex-col border-r bg-background sm:flex px-6`}
    >
      <div className="w-full flex h-14 items-center border-b lg:h-[60px]">
        <Link
          to={ROUTES.home}
          className="flex outline-none items-center gap-2 font-semibold"
        >
          <Hash className="h-7 w-7" />
          {isSideBarOpen && <span className="">{APP_NAME}</span>}
        </Link>
        {isSideBarOpen && (
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Link to={ROUTES.notifications}>
              <Bell className="h-4 w-4" />
              <span className="sr-only">notifications</span>
            </Link>
          </Button>
        )}
      </div>
      <nav className="flex flex-col flex-1 gap-2 sm:py-5">
        {MenuLinks.map((link, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={link.href}
                  className="w-full outline-none flex items-center gap-4 rounded-xl py-2 text-muted-foreground hover:text-foreground"
                >
                  <link.icon className="h-6 w-6" />
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
        ))}
      </nav>
      <nav className="flex flex-col items-center gap-2 sm:py-5">
        {!isSideBarOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  onClick={() => {
                    setIsSideBarOpen(!isSideBarOpen);
                    saveSideBarState(!isSideBarOpen);
                  }}
                  to="#"
                  className="w-full  flex items-center gap-4 rounded-xl py-2 text-muted-foreground hover:text-foreground"
                >
                  <PanelLeftOpen className="h-6 w-6" />
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
        <div className="w-full flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  className="flex items-center outline-none gap-4 rounded-xl py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-6 w-6" />
                  {isSideBarOpen && <span className="">Settings</span>}
                </Link>
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
                      setIsSideBarOpen(!isSideBarOpen);
                      saveSideBarState(!isSideBarOpen);
                    }}
                    variant="outline"
                    size="icon"
                    className="ml-auto h-8 w-8 flex items-center gap-4  py-2 text-muted-foreground hover:text-foreground"
                  >
                    <PanelLeftClose className="h-6 w-6" />
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
