import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { PenSquare, Search } from "lucide-react";
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
import { ScrollArea } from "../ui/scroll-area";
import PostsList from "../community/PostsList";
import { dummyCommunityPosts } from "@/shared/dummy-data";

function Community() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [postsLoaded, setPostsLoaded] = useState<boolean>(false);
  const [postsScrollAreaHeight, setPostsScrollAreaHeight] = useState<number>();

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const postsScrollArea = useRef<React.ElementRef<typeof ScrollArea>>(null);
  const postsWrapper = useRef<HTMLDivElement>(null);

  // Function to update the panel layout
  const setPanelSizes = (sizes: number[]) => {
    if (panelGroupRef.current) {
      panelGroupRef.current.setLayout(sizes);
    }
  };

  useEffect(() => {
    // set panels size
    function resizeContentPanel() {
      // panels
      const wd = window.innerWidth;
      if (wd > breakpoints.lg) setPanelSizes([70, 30]);
      else setPanelSizes([100, 0]);
      // posts scrollarea
      setPostsScrollAreaHeight(postsWrapper.current?.offsetHeight);
    }
    resizeContentPanel();
    window.addEventListener("resize", resizeContentPanel);
    // get data from the server
    setPostsLoaded(true);

    return () => window.removeEventListener("resize", resizeContentPanel); // clean up
  }, []);

  function newPostButtonClick() {
    const wd = window.innerWidth;
    if (wd > breakpoints.lg) setPanelSizes([70, 30]);
    else setPanelSizes([0, 100]);
  }

  function showPost(id: number) {
    console.log("Post selected ", id);
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="flex items-center gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community</h2>
          {/* <p className="mt-1 text-muted-foreground">
                  Make friends, share your thoughts and leverage the power of a
                  great community.
                </p> */}
        </div>
        <div className="relative ml-auto flex gap-2 md:grow-0">
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
          <Button variant={"outline"} size={"icon"} className="md:hidden">
            <Search className="size-4 md:size-5" />
          </Button>
          <Button variant={"outline"} size={"icon"} className="md:hidden">
            <PenSquare className="size-4 md:size-5" />
          </Button>
        </div>
      </div>
      <Separator className="my-6" />
      <PanelGroup
        ref={panelGroupRef}
        direction="horizontal"
        className="flex h-full w-full rounded-lg data-[panel-group-direction=vertical]:flex-col"
      >
        <ResizablePanel defaultSize={70}>
          <div ref={postsWrapper} className="relative flex h-full flex-col">
            <ScrollArea
              style={{ maxHeight: postsScrollAreaHeight }}
              className="h-full w-full"
              ref={postsScrollArea}
            >
              <div className="sm:grid-cols-auto-fill-270 grid h-full gap-4 pt-0">
                {postsLoaded && (
                  <PostsList
                    onSelect={showPost}
                    posts={dummyCommunityPosts.filter((x) =>
                      x.content
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )}
                  />
                )}
              </div>
            </ScrollArea>

            <div className="absolute bottom-4 right-4 hidden md:flex">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <a
                      onClick={newPostButtonClick}
                      className={`${buttonVariants({ variant: "outline", size: "icon" })} flex !size-12 items-center justify-center shadow-lg`}
                    >
                      <PenSquare className="size-4 text-muted-foreground hover:text-primary md:size-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>New post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="mx-4 hidden lg:flex" />
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
      </PanelGroup>
    </div>
  );
}

export default Community;
