import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import favoriteService, { IFavorite } from "@/services/favoriteService";
import { CanceledError } from "axios";
import FavoriteCard from "../FavoriteCard";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import FavoriteCardSkeleton from "../skeletons/FavoriteCardSkeleton";

function Favorites({ fetchLimit = 30 }: { fetchLimit?: number }) {
  const [favorites, setFavorites] = useState<IFavorite[]>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [fetchPage, setFetchPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const { request, cancel } = favoriteService.getFavorites(
      searchQuery,
      fetchPage,
      fetchLimit,
    );
    request
      .then(({ data }) => {
        setFavorites((prev) => [...(prev || []), ...data.favorites]);
        setHasMore(fetchPage < data.pages);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        toast("Failed to load favorites. Please refresh the page", {
          action: {
            label: "OK",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => setLoading(false));
    return () => cancel(); // abort http request
  }, [fetchLimit, fetchPage, searchQuery, user]);

  useEffect(() => {
    // Reset pagination to first page when search query changes
    setFetchPage(1);
    setFavorites(undefined);
  }, [searchQuery]);

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

      {isLoading && (
        <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
          {Array(12)
            .fill(null)
            .map((_, index) => (
              <FavoriteCardSkeleton key={index} />
            ))}
        </div>
      )}

      {favorites && favorites.length > 0 && (
        <>
          <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
            {favorites.map((item, index) => (
              <FavoriteCard
                key={index}
                favorite={item}
                removeFavorite={removeFavorite}
              />
            ))}
          </div>
          {hasMore && (
            <Button
              onClick={() => setFetchPage((prev) => prev + 1)}
              variant="outline"
              className="m-auto my-4 max-w-fit text-xs"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load More
            </Button>
          )}
        </>
      )}

      {!user && (
        <div className="flex size-full items-center justify-center text-center">
          <div className="flex flex-col gap-4">
            <p className="">Please login to see your favorites list.</p>
            <Button variant={"outline"} className="w-full" onClick={loginFirst}>
              Login
            </Button>
          </div>
        </div>
      )}
      {favorites && favorites.length == 0 && !isLoading && (
        <div className="flex h-full items-center justify-center">
          No saved entries.
        </div>
      )}
    </div>
  );
}

export default Favorites;
