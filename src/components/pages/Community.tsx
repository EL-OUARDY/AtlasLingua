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

function Community() {
  const [searchQuery, setSearchQuery] = useState<string>();

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  // Function to update the panel layout
  const setPanelSizes = (sizes: number[]) => {
    if (panelGroupRef.current) {
      panelGroupRef.current.setLayout(sizes);
    }
  };

  useEffect(() => {
    function resizeContentPanel() {
      const wd = window.innerWidth;

      if (wd > breakpoints.xl) setPanelSizes([70, 30]);
      else setPanelSizes([100, 0]);
    }
    resizeContentPanel();
    window.addEventListener("resize", resizeContentPanel);

    return () => window.removeEventListener("resize", resizeContentPanel); // clean up
  }, []);

  function newPostButtonClick() {
    const wd = window.innerWidth;
    if (wd > breakpoints.xl) setPanelSizes([70, 30]);
    else setPanelSizes([0, 100]);
  }

  return (
    <div className="grid h-full w-full gap-8 rounded-lg shadow-sm md:gap-4">
      <PanelGroup
        ref={panelGroupRef}
        direction="horizontal"
        className="flex h-full w-full rounded-lg border border-dashed data-[panel-group-direction=vertical]:flex-col"
      >
        <ResizablePanel defaultSize={70}>
          <div className="relative flex h-full flex-col p-6">
            <div className="flex items-center gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Community</h2>
                {/* <p className="mt-1 text-muted-foreground">
                  Make friends, share your thoughts and leverage the power of a
                  great community.
                </p> */}
              </div>
              <div className="relative ml-auto md:grow-0">
                <Search className="absolute left-2.5 top-2.5 hidden h-4 w-4 text-muted-foreground md:block" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="search"
                  placeholder="Search..."
                  className="hidden w-full rounded-lg bg-background pl-8 md:block md:w-[150px] lg:w-[250px]"
                />
                <Button variant={"outline"} size={"icon"} className="md:hidden">
                  <Search className="size-4 md:size-5" />
                </Button>
              </div>
            </div>
            <Separator className="my-6" />

            <div className="absolute bottom-4 right-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      onClick={newPostButtonClick}
                      className={`${buttonVariants({ variant: "outline", size: "icon" })}`}
                    >
                      <PenSquare className="size-4 md:size-5" />
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
        <ResizableHandle withHandle />
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
