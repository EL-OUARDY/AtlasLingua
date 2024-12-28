import { useEffect, useState } from "react";
import { ICommunityFilter, ICommunityPost } from "@/models/Community";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { toast } from "sonner";
import { Button } from "../ui/button";
import PostCard from "./PostCard";
import PostCardSkeleton from "../skeletons/PostCardSkeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface Props {
  filter: ICommunityFilter;
  onPostSelected: (id: string) => void;
}
function PostsList({ filter, onPostSelected }: Props) {
  const [posts, setPosts] = useState<ICommunityPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Store the "last document" fetched to implement pagination
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const postLimit = 20;

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const postsRef = collection(db, "posts");

      // Create query to get most recent x number of posts, ordered by 'date' descending
      // If we already have a "lastDoc", we use startAfter() to get the next page
      const postsQuery = lastDoc
        ? query(
            postsRef,
            orderBy("date", "desc"),
            startAfter(lastDoc),
            limit(postLimit),
          )
        : query(postsRef, orderBy("date", "desc"), limit(postLimit));

      const snapshot = await getDocs(postsQuery);

      if (!snapshot.empty) {
        // Save the last document from this snapshot; used in next fetch
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        // Map snapshot docs to ICommunityPost type
        const fetchedPosts: ICommunityPost[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<ICommunityPost, "id">;
          return { ...data, id: doc.id };
        });

        if (fetchedPosts.length < postLimit) {
          // If we get less than the limit, we assume there's no more data
          setHasMore(false);
        }

        // Append new posts to existing state
        setPosts((prev) => [...prev, ...fetchedPosts]);
      } else {
        // If snapshot is empty, we assume there's no more data
        setHasMore(false);
      }
    } catch (error) {
      toast("Can't proccess your request. Please try again!", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // On mount, load the initial 20 posts
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollArea className="h-full w-full">
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
          {loading &&
            Array(8)
              .fill(null)
              .map((_, index) => <PostCardSkeleton key={index} />)}
        </div>
        <div className="my-4 w-full text-center">
          {/* "Load More" button (hidden if no more data or currently loading) */}
          {hasMore && !loading && (
            <Button
              onClick={fetchPosts}
              variant="outline"
              className="max-w-fit"
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
