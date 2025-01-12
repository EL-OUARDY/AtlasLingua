import { useEffect, useRef, useState } from "react";
import { SquarePen } from "lucide-react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { buttonVariants } from "../ui/button";
import { ImperativePanelGroupHandle, PanelGroup } from "react-resizable-panels";
import { breakpoints } from "@/shared/screen-breakpoints";
import PostsList from "../community/PostsList";
import { APP_NAME } from "@/shared/constants";
import SinglePost from "../community/SinglePost";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

import PostForm from "../community/PostForm";
import WTooltip from "../ui/custom/WTooltip";
import Filter from "../community/Filter";
import { CommunityProvider } from "@/contexts/CommunityContext";

function Community() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const [postToEdit, setPostToEdit] = useState<string | null>(null);

  const [secondaryPanelVisible, setSecondaryPanelVisible] =
    useState<boolean>(true);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // get query parameters from the url
    const searchParams = new URLSearchParams(location.search);
    const newPost = searchParams.get("new_post");
    const editPost = searchParams.get("edit_post");
    const selectedPost = searchParams.get("post_id");

    setSelectedPostId(selectedPost ? selectedPost : null);
    setPostToEdit(editPost ? editPost : null);
    if (newPost || editPost) setSelectedPostId(null);

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
        if (selectedPost || newPost || editPost) setPanelsLayout([0, 100]);
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

  function showNewPostForm() {
    navigate(`${ROUTES.community}/?new_post=true`);
    setIsSearchVisible(false);
  }

  function showEditPostForm(postId: string) {
    navigate(`${ROUTES.community}/?edit_post=${postId}`);
    setIsSearchVisible(false);
  }

  function showPostPanel(id: string) {
    navigate(`${ROUTES.community}/?post_id=${id}`);
  }

  return (
    <CommunityProvider>
      <div className="flex h-full flex-col overflow-auto p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        <Filter
          search={search}
          setSearch={setSearch}
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          existSearch={() => {
            setIsSearchVisible(false);
            setSearch("");
          }}
          isMobileLayout={secondaryPanelVisible}
        />
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
              <PostsList
                onPostSelected={showPostPanel}
                selectedPostId={selectedPostId || postToEdit}
                onEdit={showEditPostForm}
              />
              {selectedPostId && (
                <div className="absolute bottom-4 right-4 hidden md:flex">
                  <WTooltip side="top" content="New post">
                    <a
                      onClick={showNewPostForm}
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
                <SinglePost postId={selectedPostId} onEdit={showEditPostForm} />
              ) : (
                <PostForm postId={postToEdit} />
              )}
            </div>
          </ResizablePanel>
        </PanelGroup>
      </div>
    </CommunityProvider>
  );
}

export default Community;
