import { ROUTES } from "@/routes/routes";
import { Languages, BookOpenText, Star, Settings, Library } from "lucide-react";
import { Link } from "react-router-dom";

function MobileNavigationBar() {
  return (
    <div className="flex justify-between gap-4 bg-background p-2 md:hidden">
      <Link
        to={ROUTES.dictionary}
        className="flex flex-1 justify-center gap-4 rounded-lg border-2 border-secondary px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <BookOpenText className="h-5 w-5" />
        <span className="sr-only">Dictionary</span>
      </Link>
      <Link
        to={ROUTES.learn}
        className="flex flex-1 justify-center gap-4 rounded-lg border-2 border-secondary px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Library className="h-5 w-5" />
        <span className="sr-only">Learn</span>
      </Link>
      <Link
        to={ROUTES.translate}
        className="relative inline-flex flex-col items-center px-6 py-3 text-xs font-medium text-muted-foreground"
      >
        <div className="absolute bottom-2 rounded-full border-2 border-secondary bg-background p-4 hover:bg-secondary">
          <Languages className="h-6 w-6" />
        </div>
        <span className="sr-only">Translate</span>
      </Link>
      <Link
        to={ROUTES.favorites}
        className="flex flex-1 justify-center gap-4 rounded-lg border-2 border-secondary px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Star className="h-5 w-5" />
        <span className="sr-only">Favorites</span>
      </Link>
      <Link
        to={ROUTES.settings.home}
        className="flex flex-1 justify-center gap-4 rounded-lg border-2 border-secondary px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Link>
    </div>
  );
}

export default MobileNavigationBar;
