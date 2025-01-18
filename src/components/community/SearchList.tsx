import { ICommunityPost } from "@/models/Community";
import { InfiniteHits } from "react-instantsearch";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ConfirmationDialog from "../ConfirmationDialog";
import { useCommunity } from "@/contexts/CommunityContext";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import PostCard from "./PostCard";
import { Timestamp } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

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
  const { deletePost } = useCommunity();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSelectedPost(selectedPostId);
  }, [selectedPostId]);

  const Hit = ({ hit }: { hit: ICommunityPost }) => (
    <PostCard
      post={hit}
      selectedPost={selectedPost}
      onSelect={(id) => {
        setSelectedPost(id);
        onPostSelected(id);
      }}
      onDelete={(postId) => setPostToDelete(postId)}
      onEdit={onEdit}
      isSearch={true}
    />
  );

  return (
    <ScrollArea className="h-full w-full text-center">
      <InfiniteHits
        hitComponent={Hit}
        classNames={{
          list: "grid gap-4 pt-0 sm:grid-cols-auto-fill-270 ",
          loadPrevious: buttonVariants({ variant: "outline" }) + " mb-4 m-auto",
          disabledLoadPrevious: "hidden",
          loadMore: buttonVariants({ variant: "outline" }) + " mt-4 m-auto",
          disabledLoadMore: "hidden",
        }}
        showPrevious={true}
        transformItems={(hits) =>
          hits.map((hit) => ({
            ...hit,
            date: Timestamp.fromDate(new Date(Number(hit.date))),
            id: hit.objectID,
          }))
        }
      />
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
