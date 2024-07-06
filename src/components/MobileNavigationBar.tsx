import { ROUTES } from "@/routes/routes";
import {
  Languages,
  BookOpenText,
  Star,
  Settings,
  MessagesSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function MobileNavigationBar() {
  return (
    <div className="fixed bottom-0 z-30 flex w-full justify-between gap-3 border-t bg-background p-2 px-4 md:hidden">
      <NavLink
        to={ROUTES.dictionary}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <BookOpenText className="size-6" />
        <span className="sr-only">Dictionary</span>
      </NavLink>
      <NavLink
        to={ROUTES.community}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <MessagesSquare className="size-6" />
        <span className="sr-only">Community</span>
      </NavLink>
      <NavLink
        to={ROUTES.translate.index}
        className="relative inline-flex flex-col items-center px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <div className="absolute bottom-2 rounded-full border border-secondary bg-background p-4">
          <Languages className="h-6 w-6" />
        </div>
        <span className="sr-only">Translate</span>
      </NavLink>
      <NavLink
        to={ROUTES.favorites}
        className="flex flex-1 justify-center gap-4 rounded-lg border border-secondary px-2.5 py-2 text-muted-foreground hover:text-foreground"
      >
        <Star className="size-6" />
        <span className="sr-only">Favorites</span>
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
