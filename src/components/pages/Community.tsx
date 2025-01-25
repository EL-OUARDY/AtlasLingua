import { useEffect, useRef, useState } from "react";
import { SquarePen } from "lucide-react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { buttonVariants } from "../ui/button";
import { ImperativePanelGroupHandle, PanelGroup } from "react-resizable-panels";
import { breakpoints } from "@/shared/screen-breakpoints";
import PostsList from "../community/PostsList";
import { APP_NAME } from "@/shared/constants";
import SinglePost from "../community/SinglePost";
import { useLocation, useSearchParams } from "react-router-dom";

import PostForm from "../community/PostForm";
import WTooltip from "../ui/custom/WTooltip";
import Filter from "../community/Filter";
import { CommunityProvider } from "@/contexts/CommunityContext";
import SearchList from "../community/SearchList";
import { InstantSearch } from "react-instantsearch";
import { algoliasearch } from "algoliasearch";

// Initialize the Algolia search client
const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APPLICATION_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_ONLY_API_KEY,
);

function Community() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postToEdit, setPostToEdit] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [secondaryPanelVisible, setSecondaryPanelVisible] =
    useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  useEffect(() => {
    // Get search query from URL
    const query = searchParams.get("search_query") || "";
    setSearchQuery(query);

    function clearSearchCache() {
      // Force clear local Algolia cache
      searchClient.transporter.requestsCache.clear();
      searchClient.transporter.responsesCache.clear();
    }
    const change =
      searchParams.get("deleted") ||
      searchParams.get("updated") ||
      searchParams.get("created") ||
      "";
    if (change) {
      clearSearchCache();
      setSearchParams((prev) => {
        prev.delete("deleted");
        prev.delete("updated");
        prev.delete("created");
        return prev;
      });
    }
  }, [searchParams, setSearchParams]);

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
    setSearchParams((prev) => {
      prev.set("new_post", "true");
      prev.delete("post_id");
      return prev;
    });
    setIsSearchVisible(false);
  }

  function showEditPostForm(postId: string) {
    setSearchParams((prev) => {
      prev.set("edit_post", postId);
      return prev;
    });
    setIsSearchVisible(false);
  }

  function showPostPanel(id: string) {
    setSearchParams((prev) => {
      prev.set("post_id", id);
      prev.delete("new_post");
      prev.delete("edit_post");
      return prev;
    });
  }

  return (
    <CommunityProvider>
      <div className="flex h-full flex-col overflow-auto p-4 shadow-sm sm:p-6 md:rounded-lg md:border md:border-dashed">
        <Filter
          isSearchVisible={isSearchVisible}
          setIsSearchVisible={setIsSearchVisible}
          existSearch={() => {
            setIsSearchVisible(false);
            setSearchParams((prev) => {
              prev.delete("search_query");
              return prev;
            });
          }}
          secondaryPanelVisible={secondaryPanelVisible}
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
              {searchQuery ? (
                // Algolia search
                <InstantSearch
                  searchClient={searchClient}
                  indexName="posts"
                  future={{ preserveSharedStateOnUnmount: true }}
                >
                  <SearchList
                    onPostSelected={showPostPanel}
                    selectedPostId={selectedPostId || postToEdit}
                    onEdit={showEditPostForm}
                  />
                </InstantSearch>
              ) : (
                <PostsList
                  onPostSelected={showPostPanel}
                  selectedPostId={selectedPostId || postToEdit}
                  onEdit={showEditPostForm}
                />
              )}

              {selectedPostId && (
                <div className="absolute bottom-4 right-4 hidden md:flex">
                  <WTooltip side="top" content="New post">
                    <span
                      onClick={showNewPostForm}
                      className={`${buttonVariants({ variant: "outline", size: "icon" })} flex !size-12 cursor-pointer items-center justify-center !rounded-full shadow-lg`}
                    >
                      <SquarePen className="size-4 text-muted-foreground hover:text-primary md:size-5" />
                    </span>
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
