import { ROUTES } from "@/routes/routes";
import { Languages, BookOpenText, Heart, Settings, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

function MobileNavigationBar() {
  return (
    <div className="flex gap-4 sm:hidden justify-between bg-background p-2">
      <NavLink
        to={ROUTES.dictionary}
        className="hover:bg-secondary rounded-lg flex-1 py-2  flex justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <BookOpenText className="h-6 w-6" />
        <span className="sr-only">Dictionary</span>
      </NavLink>
      <NavLink
        to={ROUTES.notifications}
        className="hover:bg-secondary rounded-lg flex-1 py-2 flex justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Bell className="h-6 w-6" />
        <span className="sr-only">Notifications</span>
      </NavLink>
      <NavLink
        to={ROUTES.translate}
        className="relative inline-flex flex-col items-center text-xs font-medium text-muted-foreground py-3 px-6"
      >
        <div className="absolute bottom-2 p-4 rounded-full border-2 border-secondary bg-background hover:bg-secondary">
          <Languages className="h-7 w-7" />
        </div>
        <span className="sr-only">Translate</span>
      </NavLink>
      <NavLink
        to={ROUTES.favorites}
        className="hover:bg-secondary rounded-lg flex-1 flex py-2 justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Heart className="h-6 w-6" />
        <span className="sr-only">Favorites</span>
      </NavLink>
      <NavLink
        to="#"
        className="hover:bg-secondary rounded-lg flex-1 flex py-2 justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-6 w-6" />
        <span className="sr-only">Settings</span>
      </NavLink>
    </div>
  );
}

export default MobileNavigationBar;
