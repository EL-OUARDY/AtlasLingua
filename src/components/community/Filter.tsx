import { ICommunityFilter } from "@/models/Community";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ChevronDown,
  BlocksIcon,
  TrendingUp,
  MessageSquareOffIcon,
  UserIcon,
  Search,
  SquarePen,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCommunity } from "@/contexts/CommunityContext";

interface Props {
  isSearchVisible: boolean;
  setIsSearchVisible: (visible: boolean) => void;
  secondaryPanelVisible: boolean;
  existSearch: () => void;
}

function Filter({
  secondaryPanelVisible,
  isSearchVisible,
  setIsSearchVisible,
  existSearch,
}: Props) {
  const { filter, setFilter } = useCommunity();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search_query") || "",
  );

  useEffect(() => {
    // Update URL when search changes
    setSearchParams((prev) => {
      if (search) {
        prev.set("search_query", search);
      } else {
        prev.delete("search_query");
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    // Clear search if URL changes
    const query = searchParams.get("search_query") || "";
    if (!query) setSearch("");
  }, [searchParams]);

  // Callback ref function to focus the input when it mounts
  const focusOnMountRef = useCallback((element: HTMLInputElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  function hidePostPanel() {
    setSearchParams((prev) => {
      prev.delete("new_post");
      prev.delete("post_id");
      prev.delete("edit_post");
      return prev;
    });
  }
  return (
    <div className="flex items-center gap-2 md:flex-row">
      <div className="flex flex-1 items-center">
        <Tabs
          className="hidden lg:block"
          defaultValue={filter.sortBy}
          onValueChange={(value) =>
            setFilter({
              ...filter,
              sortBy: value as ICommunityFilter["sortBy"],
            })
          }
        >
          <div className="flex items-center">
            <TabsList className="">
              <TabsTrigger
                value="latest"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Popular
              </TabsTrigger>
              <TabsTrigger
                value="unanswered"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unanswered
              </TabsTrigger>
              <TabsTrigger
                value="user"
                className="text-zinc-600 dark:text-zinc-200"
              >
                My Posts
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="w-full lg:hidden">
          {!secondaryPanelVisible && isSearchVisible ? (
            <Input
              ref={focusOnMountRef}
              value={search}
              id="search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background no-ring md:block md:w-[150px] lg:w-[250px]"
              autoComplete="off"
            />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] justify-between px-3 py-2 capitalize"
                >
                  {filter.sortBy === "user" ? "My Posts" : filter.sortBy}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                alignOffset={0}
                className=""
                forceMount
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter({ ...filter, sortBy: "latest" });
                    hidePostPanel();
                  }}
                  className="cursor-pointer"
                >
                  <BlocksIcon className="mr-2 size-4" /> Latest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter({ ...filter, sortBy: "popular" });
                    hidePostPanel();
                  }}
                  className="cursor-pointer"
                >
                  <TrendingUp className="mr-2 size-4" /> Popular
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter({ ...filter, sortBy: "unanswered" });
                    hidePostPanel();
                  }}
                  className="cursor-pointer"
                >
                  <MessageSquareOffIcon className="mr-2 size-4" /> Unanswered
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter({ ...filter, sortBy: "user" });
                    hidePostPanel();
                  }}
                  className="cursor-pointer"
                >
                  <UserIcon className="mr-2 size-4" /> My Posts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="ml-auto flex gap-2 md:grow-0">
        <div className="hidden gap-1 md:flex">
          <Input
            value={search}
            id="search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="search"
            placeholder="Search..."
            className="hidden w-full rounded-lg bg-background no-ring md:block md:w-[150px] lg:w-[250px]"
            autoComplete="off"
          />
        </div>
        <Button
          className="hidden xl:flex"
          onClick={() => {
            setSearchParams((prev) => {
              prev.set("new_post", "true");
              prev.delete("post_id");
              return prev;
            });
          }}
        >
          <SquarePen className="mr-2 size-4" /> New Post
        </Button>
        {!secondaryPanelVisible && !isSearchVisible && (
          <Button
            onClick={() => {
              setIsSearchVisible(true);
            }}
            variant={"outline"}
            size={"icon"}
            className="hover:bg-background focus:bg-background md:hidden"
          >
            <Search className="size-4 md:size-5" />
          </Button>
        )}
        {!secondaryPanelVisible && isSearchVisible && (
          <Button
            onClick={() => {
              setSearch("");
              existSearch();
            }}
            variant={"outline"}
            size={"icon"}
            className="lg:hidden"
          >
            <X className="size-4 md:size-5" />
          </Button>
        )}
        {!secondaryPanelVisible && !isSearchVisible && (
          <Button
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("new_post", "true");
                prev.delete("post_id");
                return prev;
              });
            }}
            variant={"outline"}
            size={"icon"}
            className="lg:hidden"
          >
            <SquarePen className="size-4 md:size-5" />
          </Button>
        )}
        {secondaryPanelVisible && (
          <Button
            onClick={hidePostPanel}
            variant={"outline"}
            size={"icon"}
            className="lg:hidden"
          >
            <X className="size-4 md:size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Filter;
