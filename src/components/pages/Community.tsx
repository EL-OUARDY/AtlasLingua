import { useState } from "react";
import { Separator } from "../ui/separator";
import { PenSquare, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { buttonVariants } from "../ui/button";

function Community() {
  const [searchQuery, setSearchQuery] = useState<string>();

  // useEffect(() => {
  //   resizeContentPanel();
  //   window.addEventListener("resize", resizeContentPanel);

  //   return () => window.removeEventListener("resize", resizeContentPanel); // clean up
  // }, []);

  // function resizeContentPanel() {
  //   const wd = window.innerWidth;
  //   console.log(wd);
  //   if (wd > breakpoints.lg) setContentSize(70);
  //   else setContentSize(100);
  // }

  const changeLayout = () => {
    console.log("layout change");
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-dashed p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Community</h2>
          <p className="mt-1 text-muted-foreground">
            Make friends, share your thoughts and leverage the power of a great
            community.
          </p>
        </div>
        <div className="relative flex-1 md:ml-auto md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[150px] lg:w-[250px]"
          />
        </div>
      </div>
      <Separator className="my-6" />

      <div className="grid h-full w-full gap-8 rounded-lg md:gap-4">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={70}>
            <div className="relative flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
              <div className="absolute bottom-4 right-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        onClick={changeLayout}
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
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default Community;
