import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/routes/routes";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-start p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <h1 className="hidden text-xl font-bold tracking-tight sm:block md:text-2xl"></h1>
      <div className="flex flex-1 items-center justify-center p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            <strong>404</strong> — Feeling Lost?
          </h3>
          <p className="mb-2 text-sm text-muted-foreground">
            Don't worry you can always back to home page
          </p>
          <Link
            to={ROUTES.home}
            className={buttonVariants({ variant: "default" })}
          >
            Go HomePage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
