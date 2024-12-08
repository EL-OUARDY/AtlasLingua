import { ROUTES } from "@/routes/routes";
import { Settings, Star, MessagesSquare, Library } from "lucide-react";
import { NavLink } from "react-router-dom";
import { LanguagesIcon } from "./ui/icons/Languages";

function MobileNavigationBar() {
  return (
    <div className="fixed bottom-0 z-30 flex w-full justify-between gap-3 border-t bg-background p-2 px-4 md:hidden">
      <NavLink
        to={ROUTES.community}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <MessagesSquare className="size-6" />
        <span className="sr-only">Community</span>
      </NavLink>
      <NavLink
        to={ROUTES.favorites}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <Star className="size-6" />
        <span className="sr-only">Favorites</span>
      </NavLink>

      <NavLink
        to={ROUTES.translate.index}
        className="relative inline-flex flex-col items-center px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <div className="absolute bottom-2 rounded-full border border-secondary bg-background p-4">
          <LanguagesIcon className="size-6" />
        </div>
        <span className="sr-only">Translate</span>
      </NavLink>

      <NavLink
        to={ROUTES.learn}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <Library className="size-6" />
        <span className="sr-only">Learn</span>
      </NavLink>
      <NavLink
        to={ROUTES.settings.general}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <Settings className="size-6" />
        <span className="sr-only">Settings</span>
      </NavLink>
    </div>
  );
}

export default MobileNavigationBar;
