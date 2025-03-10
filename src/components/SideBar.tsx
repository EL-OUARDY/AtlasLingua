import { Settings, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { APP_NAME } from "@/shared/constants";
import { ROUTES } from "@/routes/routes";
import { MenuLinks } from "@/shared/menu-links";
import { ScrollArea } from "./ui/scroll-area";
import WTooltip from "./ui/custom/WTooltip";
import Logo from "./ui/icons/Logo";

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

  return (
    <aside
      id={isSideBarOpen ? "sidebar-open" : "sidebar-closed"}
      className={`${
        isSideBarOpen
          ? "w-[220px] min-w-[220px] lg:w-[240px] lg:min-w-[240px]"
          : ""
      } z-10 hidden h-screen min-w-14 flex-col border-r bg-background px-6 md:flex`}
    >
      <div className="flex h-14 max-h-14 min-h-14 w-full items-center border-b lg:h-[60px] lg:max-h-[60px] lg:min-h-[60px]">
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 font-semibold outline-none"
        >
          <Logo className="size-5" />
          {isSideBarOpen && <span className="">{APP_NAME}</span>}
        </Link>
      </div>
      <ScrollArea className="h-full">
        <div className="flex-grow overflow-auto">
          <nav className="flex flex-1 flex-col gap-2 sm:py-5">
            {MenuLinks.filter((link) => link.onlyMobile == false).map(
              (link, index) => (
                <WTooltip
                  key={index}
                  className={isSideBarOpen ? "!hidden" : ""}
                  side="right"
                  content={link.text}
                >
                  <NavLink
                    to={link.href}
                    className="flex w-full items-center gap-4 rounded-xl py-2 text-muted-foreground outline-none hover:text-foreground [#sidebar-closed_&]:justify-center"
                  >
                    <link.icon className="size-6" />
                    {isSideBarOpen && <span className="">{link.text}</span>}
                  </NavLink>
                </WTooltip>
              ),
            )}
          </nav>
        </div>
      </ScrollArea>
      <nav className="flex flex-col items-center gap-2 sm:py-5">
        {!isSideBarOpen && (
          <WTooltip
            className={isSideBarOpen ? "!hidden" : ""}
            side="right"
            content="Expand Menu"
          >
            <Link
              onClick={() => {
                saveSideBarState(!isSideBarOpen);
              }}
              to="#"
              className="flex w-full items-center gap-4 rounded-xl py-2 text-muted-foreground hover:text-foreground"
            >
              <PanelLeftOpen className="size-6" />
            </Link>
          </WTooltip>
        )}
        <div className="flex w-full items-center">
          <WTooltip
            className={isSideBarOpen ? "!hidden" : ""}
            side="right"
            content="Settings"
          >
            <NavLink
              to={ROUTES.settings.profile}
              className="flex items-center gap-4 rounded-xl py-2 text-muted-foreground outline-none hover:text-foreground"
            >
              <Settings className="size-6" />
              {isSideBarOpen && <span className="">Settings</span>}
            </NavLink>
          </WTooltip>
          {isSideBarOpen && (
            <div className="ml-auto">
              <WTooltip side="right" content="Collapse Menu">
                <Link
                  to="#"
                  onClick={() => {
                    saveSideBarState(!isSideBarOpen);
                  }}
                  className={
                    buttonVariants({ variant: "outline", size: "icon" }) +
                    " flex h-8 w-8 items-center gap-4 py-2 text-muted-foreground hover:text-foreground"
                  }
                >
                  <PanelLeftClose className="size-5" />
                  <span className="sr-only">Collapse Menu</span>
                </Link>
              </WTooltip>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default SideBar;
