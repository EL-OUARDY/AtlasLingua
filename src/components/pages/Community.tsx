import { useCallback, useEffect, useRef, useState } from "react";
import {
  BlocksIcon,
  ChevronDown,
  MessageSquareOffIcon,
  Search,
  SquarePen,
  TrendingUp,
  UserIcon,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { Button, buttonVariants } from "../ui/button";
import { ImperativePanelGroupHandle, PanelGroup } from "react-resizable-panels";
import { breakpoints } from "@/shared/screen-breakpoints";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PostsList from "../community/PostsList";
import { APP_NAME } from "@/shared/constants";
import SinglePost from "../community/SinglePost";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

import NewPost from "../community/NewPost";
import WTooltip from "../ui/custom/WTooltip";
import { toast } from "sonner";
import { ICommunityFilter } from "@/models/Community";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function Community() {
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>();
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ICommunityFilter>({
    searchQuery: "",
    sortBy: "Latest",
  });

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [secondaryPanelVisible, setSecondaryPanelVisible] =
    useState<boolean>(true);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    toast("Community Feature Coming Soon", {
      duration: 60000,
      action: {
        label: "Hide",
        onClick: () => {},
      },
      description:
        "This is just a demo of what the community platform will look like in the future. The ability to post and reply to others is not yet implemented. Stay tuned for updates!",
    });

    return () => {
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    // get post id from the url
    const searchParams = new URLSearchParams(location.search);
    const newPost = searchParams.get("new_post");
    const postId = searchParams.get("post_id");
    setSelectedPostId(postId ? Number(postId) : undefined);
    if (newPost) setSelectedPostId(undefined);

    // set panels size
    function resizeContentPanel() {
      const wd = window.innerWidth;
      // on larger screens: expand post panel if it is smaller
      if (panelGroupRef.current && wd > breakpoints.lg)
        if (
          panelGroupRef.current.getLayout()[0] === 0 ||
          panelGroupRef.current.getLayout()[1] < 5
        )
          setPanelsLayout([70, 30]);

      // on smaller screens: only show one panel
      if (wd < breakpoints.lg)
        if (postId || newPost) setPanelsLayout([0, 100]);
        else setPanelsLayout([100, 0]);
    }
    resizeContentPanel();
    window.addEventListener("resize", resizeContentPanel);

    return () => window.removeEventListener("resize", resizeContentPanel); // clean up
  }, [location]);

  // Function to update the panel layout
  const setPanelsLayout = (sizes: number[]) => {
    // track the state of the post  panel
    setSecondaryPanelVisible(sizes[1] === 0 ? false : true);
    if (panelGroupRef.current) {
      panelGroupRef.current.setLayout(sizes);
    }
  };

  function newPostButtonClick() {
    navigate(`${ROUTES.community}/?new_post=true`);
    existSearch();
  }

  function showPostPanel(id: number) {
    navigate(`${ROUTES.community}/?post_id=${id}`);
  }

  function hidePostPanel() {
    navigate(ROUTES.community);
  }

  function existSearch() {
    setIsSearchVisible(false);
    setSearch("");
    setFilter({
      ...filter,
      searchQuery: "",
    });
  }

  // Callback ref function to focus the input when it mounts
  const focusOnMountRef = useCallback((element: HTMLInputElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);

  return (
    <div className="flex h-full flex-col overflow-auto p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
      {JSON.stringify(filter)} <br />
      {JSON.stringify(search)}
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
                  value="voted"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Most Voted
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
                    className="w-[140px] justify-between px-3 py-2"
                  >
                    {filter.sortBy}
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
                      setFilter({ ...filter, sortBy: "Latest" });
                      hidePostPanel();
                    }}
                    className="cursor-pointer"
                  >
                    <BlocksIcon className="mr-2 size-4" /> Latest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter({ ...filter, sortBy: "Most Voted" });
                      hidePostPanel();
                    }}
                    className="cursor-pointer"
                  >
                    <TrendingUp className="mr-2 size-4" /> Most Voted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter({ ...filter, sortBy: "Unanswered" });
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
                      setFilter({ ...filter, sortBy: "My Posts" });
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
            <Button
              onClick={() => {
                setFilter({
                  ...filter,
                  searchQuery: search,
                });
              }}
              variant="outline"
              size="icon"
            >
              <Search className="size-5" />
            </Button>
          </div>
          <Button className="hidden xl:flex" onClick={newPostButtonClick}>
            <SquarePen className="mr-2 size-4" /> New Post
          </Button>
          {!secondaryPanelVisible && (
            <Button
              onClick={() => {
                if (isSearchVisible) {
                  setFilter({
                    ...filter,
                    searchQuery: search,
                  });
                } else {
                  setIsSearchVisible(true);
                }
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
              onClick={() => existSearch()}
              variant={"outline"}
              size={"icon"}
              className="lg:hidden"
            >
              <X className="size-4 md:size-5" />
            </Button>
          )}
          {!secondaryPanelVisible && !isSearchVisible && (
            <Button
              onClick={newPostButtonClick}
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
      <PanelGroup
        onLayout={(layout) =>
          localStorage.setItem(
            APP_NAME + "-community-layout",
            JSON.stringify(layout),
          )
        }
        ref={panelGroupRef}
        direction="horizontal"
        className="mt-6 flex w-full flex-1 overflow-auto rounded-lg data-[panel-group-direction=vertical]:flex-col"
      >
        <ResizablePanel defaultSize={100}>
          <div className="relative flex h-full flex-col">
            <ScrollArea className="h-full w-full">
              <PostsList onSelect={showPostPanel} filter={filter} />
              <ScrollBar orientation="horizontal" className="cursor-grab" />
            </ScrollArea>

            {selectedPostId && (
              <div className="absolute bottom-4 right-4 hidden md:flex">
                <WTooltip side="top" content="New post">
                  <a
                    onClick={newPostButtonClick}
                    className={`${buttonVariants({ variant: "outline", size: "icon" })} flex !size-12 cursor-pointer items-center justify-center shadow-lg`}
                  >
                    <SquarePen className="size-4 text-muted-foreground hover:text-primary md:size-5" />
                  </a>
                </WTooltip>
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="mx-4 hidden lg:flex" />
        <ResizablePanel defaultSize={0}>
          <div className="flex h-full items-center justify-center">
            {selectedPostId ? (
              <SinglePost postId={selectedPostId} />
            ) : (
              <NewPost />
            )}
          </div>
        </ResizablePanel>
      </PanelGroup>
    </div>
  );
}

export default Community;
