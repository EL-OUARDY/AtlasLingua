import WordCard from "../WordCard";
import { Separator } from "../ui/separator";
import ScrollableMenu from "../ScrollableMenu";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORIES } from "@/models/Dictionary";
import dictionaryService from "@/services/dictionaryService";
import { IDictionary } from "@/models/Dictionary";
import { CanceledError } from "axios";
import { toast } from "sonner";
import WordCardSkeleton from "../skeletons/WordCardSkeleton";
import favoriteService from "@/services/favoriteService";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import { useNavigate } from "react-router-dom";

function Learn() {
  const [dictionaryData, setDictionaryData] = useState<IDictionary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("family");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = dictionaryService.getCategory(selectedCategory);
    request
      .then((res) => {
        setDictionaryData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        toast("Failed to load data. Please refresh the page.", {
          action: {
            label: "OK",
            onClick: () => window.location.reload(),
          },
        });
      })
      .finally(() => {});
    return () => cancel(); // abort http request
  }, [selectedCategory]);

  function addFavorite(word: IDictionary) {
    const oldData = dictionaryData;
    const newData = dictionaryData.map((item) =>
      item.id === word.id ? { ...item, favorite: true } : item,
    );
    setDictionaryData(newData);

    const { request } = favoriteService.addFavoriteFromDictionary(word.id);

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // user not logged in
      if (err.response && err.response.status === 401) {
        loginFirst();
        return;
      }

      // if unable to add then restore the list
      setDictionaryData(oldData);

      toast("Failed process your request.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function removeFavorite(word: IDictionary) {
    const oldData = dictionaryData;
    const newData = dictionaryData.map((item) =>
      item.id === word.id ? { ...item, favorite: false } : item,
    );
    setDictionaryData(newData);

    const { request } = favoriteService.removeDictionaryFavorite(word.id);

    request.catch((err) => {
      if (err instanceof CanceledError) return;

      // user not logged in
      if (err.response && err.response.status === 401) {
        loginFirst();
        return;
      }

      // if unable to add then restore the list
      setDictionaryData(oldData);

      toast("Failed process your request.", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    });
  }

  function loginFirst() {
    // save return url
    localStorage.setItem(APP_NAME + "-return-url", ROUTES.learn);
    // navigate to login
    navigate(ROUTES.login);
  }

  return (
    <div className="flex h-full flex-col p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Learn</h2>
          <p className="mt-1 text-muted-foreground">
            Darija Learning Center: Tools and Resources.
          </p>
        </div>
        <div className="relative flex-1 md:ml-auto md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            id="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
      <Separator className="my-6 hidden sm:block" />
      <div className="flex flex-col gap-4">
        <ScrollableMenu
          onChange={(link) => setSelectedCategory(link)}
          links={CATEGORIES}
          selected={selectedCategory}
          className="hidden h-fit flex-row gap-4 sm:flex"
        />

        <div className="mt-4 w-full sm:hidden">
          <Select onValueChange={(link) => setSelectedCategory(link)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat, index) => (
                <SelectItem key={index} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid h-fit gap-4 sm:grid-cols-auto-fill-270">
          {isLoading &&
            Array(12)
              .fill(null)
              .map((_, index) => <WordCardSkeleton key={index} />)}

          {!isLoading &&
            dictionaryData
              .filter(
                (x) =>
                  x.english.includes(searchQuery) ||
                  x.darija.includes(searchQuery) ||
                  x.arabic.includes(searchQuery),
              )
              .map((item, index) => (
                <WordCard
                  key={index}
                  word={item}
                  addFavorite={addFavorite}
                  removeFavorite={removeFavorite}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Learn;
