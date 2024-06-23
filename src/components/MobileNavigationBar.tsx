import { ROUTES } from "@/routes/routes";
import { Languages, BookOpenText, Star, Settings, Library } from "lucide-react";
import { Link } from "react-router-dom";

function MobileNavigationBar() {
  return (
    <div className="flex gap-4 sm:hidden justify-between bg-background p-2">
      <Link
        to={ROUTES.dictionary}
        className="border-2 border-secondary hover:bg-secondary rounded-lg flex-1 py-2  flex justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <BookOpenText className="h-5 w-5" />
        <span className="sr-only">Dictionary</span>
      </Link>
      <Link
        to={ROUTES.learn}
        className="border-2 border-secondary hover:bg-secondary rounded-lg flex-1 py-2 flex justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Library className="h-5 w-5" />
        <span className="sr-only">Learn</span>
      </Link>
      <Link
        to={ROUTES.translate}
        className="relative inline-flex flex-col items-center text-xs font-medium text-muted-foreground py-3 px-6"
      >
        <div className="absolute bottom-2 p-4 rounded-full border-2 border-secondary bg-background hover:bg-secondary">
          <Languages className="h-6 w-6" />
        </div>
        <span className="sr-only">Translate</span>
      </Link>
      <Link
        to={ROUTES.favorites}
        className="border-2 border-secondary hover:bg-secondary rounded-lg flex-1 flex py-2 justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Star className="h-5 w-5" />
        <span className="sr-only">Favorites</span>
      </Link>
      <Link
        to={"#"}
        className="border-2 border-secondary hover:bg-secondary rounded-lg flex-1 flex py-2 justify-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Link>
    </div>
  );
}

export default MobileNavigationBar;
