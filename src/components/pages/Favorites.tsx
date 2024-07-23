import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import WordCardSkeleton from "../skeletons/WordCardSkeleton";
import { toast } from "sonner";
import favoriteService, { IFavorite } from "@/services/favoriteService";
import { CanceledError } from "axios";
import FavoriteCard from "../FavoriteCard";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";

function Favorites() {
  const [favorites, setFavorites] = useState<IFavorite[]>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const { request, cancel } = favoriteService.getFavorites(searchQuery);
    request
      .then(({ data }) => {
        setFavorites(data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        toast("Failed to load data. Please refresh the page", {
          action: {
            label: "OK",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => cancel(); // abort http request
  }, [searchQuery, user]);

  function removeFavorite(id: number) {
    const { request } = favoriteService.deleteFavorite(id);

    // delete from favorite list
    const oldFavoriteList = favorites;
    setFavorites(favorites?.filter((f) => f.id != id));

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // if unable to delete then return deleted to the list
      setFavorites(oldFavoriteList);

      toast("Failed process your request", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(APP_NAME + "-return-url", ROUTES.favorites);
    // navigate to login
    navigate(ROUTES.login);
  }

  return (
    <div className="flex h-full flex-col p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Favorites</h2>
        </div>
        <div className="relative flex-1 md:ml-auto md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search..."
            autoComplete="off"
            className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
      <Separator className="my-6" />

      {isLoading ? (
        <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
          {Array(12)
            .fill(null)
            .map((_, index) => (
              <WordCardSkeleton key={index} />
            ))}
        </div>
      ) : !user ? (
        <div className="flex size-full items-center justify-center text-center">
          <div className="flex flex-col gap-4">
            <p className="">Please login to see your favorites list.</p>
            <Button variant={"outline"} className="w-full" onClick={loginFirst}>
              Login
            </Button>
          </div>
        </div>
      ) : (
        favorites && (
          <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
            {favorites.map((item, index) => (
              <FavoriteCard
                key={index}
                favorite={item}
                removeFavorite={removeFavorite}
              />
            ))}
          </div>
        )
      )}

      {favorites && favorites.length == 0 && (
        <div className="flex h-full items-center justify-center">
          No saved entries.
        </div>
      )}
    </div>
  );
}

export default Favorites;
