import { useEffect, useRef, useState } from "react";
import { Search, SquarePen, X } from "lucide-react";
import { Input } from "../ui/input";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button, buttonVariants } from "../ui/button";
import { ImperativePanelGroupHandle, PanelGroup } from "react-resizable-panels";
import { breakpoints } from "@/shared/screen-breakpoints";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PostsList from "../community/PostsList";
import { dummyCommunityPosts } from "@/shared/dummy-data";
import { APP_NAME } from "@/shared/constants";
import Post from "../community/Post";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import NewPost from "../community/NewPost";

function Community() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>();
  const [secondaryPanelVisible, setSecondaryPanelVisible] =
    useState<boolean>(true);
  const [postsLoaded, setPostsLoaded] = useState<boolean>(false);

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const location = useLocation();
  const navigate = useNavigate();

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
    // get data from the server
    setPostsLoaded(true);

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
    navigate(`${ROUTES.community}/?new_post=1`);
  }

  function showPostPanel(id: number) {
    navigate(`${ROUTES.community}/?post_id=${id}`);
  }

  function hidePostPanel() {
    navigate(ROUTES.community);
  }

  return (
    <div className="flex h-full flex-col overflow-auto rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="flex items-center gap-4 md:flex-row">
        <div className="flex items-center">
          {/* <h2 className="text-2xl font-bold tracking-tight">Community</h2> */}
          {/* <p className="mt-1 text-muted-foreground">
                  Make friends, share your thoughts and leverage the power of a
                  great community.
                </p> */}
          <Tabs
            className="hidden lg:block"
            defaultValue="latest"
            onValueChange={(x) => console.log(x)}
          >
            <div className="flex items-center">
              <TabsList className="ml-auto">
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

          <div className="lg:hidden">
            <Select
              onValueChange={(x) => console.log(x)}
              defaultValue={"latest"}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="voted">Most Voted</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="user">My Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="ml-auto flex gap-2 md:grow-0">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 hidden h-4 w-4 text-muted-foreground md:block" />
            <Input
              value={searchQuery}
              id="search"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              type="search"
              placeholder="Search..."
              className="hidden w-full rounded-lg bg-background pl-8 md:block md:w-[150px] lg:w-[250px]"
            />
          </div>
          <Button className="hidden xl:flex" onClick={newPostButtonClick}>
            <SquarePen className="mr-2 h-4 w-4" /> New Post
          </Button>
          <Button variant={"outline"} size={"icon"} className="md:hidden">
            <Search className="size-4 md:size-5" />
          </Button>
          {!secondaryPanelVisible && (
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
      {/* <Separator className="my-6" /> */}
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
        <ResizablePanel defaultSize={70}>
          <div className="relative flex h-full flex-col">
            <ScrollArea className="h-full w-full">
              <div className="grid h-full gap-4 pt-0 sm:grid-cols-auto-fill-270">
                {postsLoaded && (
                  <PostsList
                    onSelect={showPostPanel}
                    posts={dummyCommunityPosts.filter((x) =>
                      x.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )}
                  />
                )}
              </div>
              <ScrollBar orientation="horizontal" className="cursor-grab" />
            </ScrollArea>

            {selectedPostId && (
              <div className="absolute bottom-4 right-4 hidden md:flex">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <a
                        onClick={newPostButtonClick}
                        className={`${buttonVariants({ variant: "outline", size: "icon" })} flex !size-12 items-center justify-center shadow-lg`}
                      >
                        <SquarePen className="size-4 text-muted-foreground hover:text-primary md:size-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="mx-4 hidden lg:flex" />
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center">
            {selectedPostId ? <Post postId={selectedPostId} /> : <NewPost />}
          </div>
        </ResizablePanel>
      </PanelGroup>
    </div>
  );
}

export default Community;
