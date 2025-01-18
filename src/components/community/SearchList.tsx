/* eslint-disable react-hooks/exhaustive-deps */
import { Configure, useInfiniteHits } from "react-instantsearch";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ConfirmationDialog from "../ConfirmationDialog";
import { useCommunity } from "@/contexts/CommunityContext";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import PostCard from "./PostCard";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  onPostSelected: (id: string) => void;
  selectedPostId: string | null;
  onEdit: (postId: string) => void;
}

export default function SearchList({
  onPostSelected,
  selectedPostId,
  onEdit,
}: Props) {
  const { deletePost, posts, updatePosts, resetPosts } = useCommunity();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [, setSearchParams] = useSearchParams();

  const { items, showMore, isLastPage, results } = useInfiniteHits();
  const { filter } = useCommunity();

  useEffect(() => {
    updatePosts([]); // Clear posts
    return () => resetPosts(); // Remove search results when component unmounts
  }, []);

  useEffect(() => {
    updatePosts(items);
  }, [results]);

  useEffect(() => {
    setSelectedPost(selectedPostId);
  }, [selectedPostId]);

  return (
    <ScrollArea className="h-full w-full text-center">
      <Configure query={filter.searchQuery} hitsPerPage={30} />

      {posts.length === 0 && (
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
            onDelete={(postId) => setPostToDelete(postId)}
            onEdit={onEdit}
          />
        ))}
      </div>
      <button
        onClick={showMore}
        disabled={isLastPage}
        className={cn(
          buttonVariants({ variant: "outline" }) + " m-auto mt-4",
          isLastPage && "hidden",
        )}
      >
        Show more results
      </button>
      <ConfirmationDialog
        title="Are you absolutely sure?"
        description="This action cannot be undone! This will permanently delete your post."
        onOK={() => {
          deletePost(postToDelete as string);
          setPostToDelete(null);
          setSearchParams((prev) => {
            prev.set("deleted", "true");
            prev.delete("post_id");
            prev.delete("edit_post");
            return prev;
          });
        }}
        onAbort={() => setPostToDelete(null)}
        isOpen={!!postToDelete}
      />
      <ScrollBar orientation="horizontal" className="cursor-grab" />
    </ScrollArea>
  );
}
