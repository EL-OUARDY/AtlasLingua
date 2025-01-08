import { useEffect, useState } from "react";
import { ICommunityFilter } from "@/models/Community";
import { Button } from "../ui/button";
import PostCard from "./PostCard";
import PostCardSkeleton from "../skeletons/PostCardSkeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useCommunity } from "@/contexts/CommunityContext";

interface Props {
  filter: ICommunityFilter;
  onPostSelected: (id: string) => void;
}
function PostsList({ filter, onPostSelected }: Props) {
  const { posts, fetchPosts, loadingPosts, hasMorePosts } = useCommunity();
  const [selectedPost, setSelectedPost] = useState<string>("");

  // On mount, load posts
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollArea className="h-full w-full">
        {posts.length === 0 && !loadingPosts && (
          <div className="flex size-full items-center justify-center text-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <p className="">No posts available.</p>
            </div>
          </div>
        )}
        <div className="grid gap-4 pt-0 sm:grid-cols-auto-fill-270">
          {posts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              selectedPost={selectedPost}
              onSelect={(id) => {
                setSelectedPost(id);
                onPostSelected(id);
              }}
            />
          ))}
          {loadingPosts &&
            Array(8)
              .fill(null)
              .map((_, index) => <PostCardSkeleton key={index} />)}
        </div>
        <div className="my-4 w-full text-center">
          {/* "Load More" button (hidden if no more data or currently loading) */}
          {hasMorePosts && !loadingPosts && (
            <Button
              onClick={fetchPosts}
              variant="outline"
              className="max-w-fit text-xs"
            >
              Load More
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" className="cursor-grab" />
      </ScrollArea>
    </>
  );
}

export default PostsList;
