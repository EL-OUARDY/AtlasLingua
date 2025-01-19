import {
  ICommunityComment,
  ICommunityFilter,
  ICommunityPost,
  IReportPost,
  SortOption,
} from "@/models/Community";
import { db } from "@/services/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  startAfter,
  getDoc,
  doc,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  where,
  QueryConstraint,
  writeBatch,
} from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import ReportPostProvider from "./ReportPostContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useUser } from "./UserContext";
import type { BaseHit, Hit } from "instantsearch.js";
interface ICommunityContext {
  posts: ICommunityPost[];
  updatePosts: (hits: Hit<BaseHit>[]) => void;
  resetPosts: () => void;
  loadingPosts: boolean;
  hasMorePosts: boolean;
  fetchPosts: () => Promise<void>;
  post: ICommunityPost | null | undefined;
  getPost: (postId: string) => Promise<ICommunityPost | null>;
  fetchPost: (postId: string) => Promise<void>;
  loadingSinglePost: boolean;
  comments: ICommunityComment[];
  fetchComments: (postId: string) => Promise<void>;
  loadingComments: boolean;
  hasMoreComments: boolean;
  addPost: (post: Omit<ICommunityPost, "id">) => Promise<ICommunityPost>;
  editPost: (
    postId: string,
    updatedPostData: Partial<ICommunityPost>,
  ) => Promise<ICommunityPost>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (
    postId: string,
    comment: Omit<ICommunityComment, "id">,
  ) => Promise<ICommunityComment>;
  editComment: (
    postId: string,
    commentId: string,
    updatedCommentData: Partial<ICommunityComment>,
  ) => Promise<ICommunityComment>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  reportPost: (report: IReportPost) => Promise<void>;
  filter: ICommunityFilter;
  setFilter: (filter: ICommunityFilter) => void;
}

const CommunityContext = createContext<ICommunityContext>(
  {} as ICommunityContext,
);

// custom hook to expose the CommunityContext
export function useCommunity() {
  return useContext(CommunityContext);
}

interface Props {
  children: ReactNode;
  fetchLimit?: number;
}
export function CommunityProvider({ children, fetchLimit = 30 }: Props) {
  const [posts, setPosts] = useState<ICommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  // Store the "last post document" fetched to implement pagination
  const lastFetchedPostDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );

  const [post, setPost] = useState<ICommunityPost | null>();
  const [loadingSinglePost, setLoadingSinglePost] = useState<boolean>(true);
  const [comments, setComments] = useState<ICommunityComment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  // Store the "last comment document" fetched to implement pagination
  const lastFetchedCommentDoc =
    useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [filter, setFilter] = useState<ICommunityFilter>({
    searchQuery: "",
    sortBy: "latest",
  });

  const navigate = useNavigate();

  const { user } = useUser();

  useEffect(() => {
    resetPosts();
    setFilter({
      ...filter,
      searchQuery: "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.sortBy]);

  function resetPosts() {
    lastFetchedPostDoc.current = null;
    setPosts([]);
    fetchPosts();
  }

  async function fetchPosts() {
    setLoadingPosts(true);

    try {
      const postsRef = collection(db, "posts");

      // Create query to get most recent x number of posts, ordered by 'date' descending
      const constraints: QueryConstraint[] = [limit(fetchLimit)];

      // Sort by latest posts
      if (filter.sortBy === SortOption.Latest) {
        constraints.push(orderBy("date", "desc"));
      }

      // Sort by popular posts
      if (filter.sortBy === SortOption.Popular) {
        // Get the timestamp for one month ago
        const oneMonthAgo = Timestamp.fromDate(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        ); // 30 days ago
        constraints.push(where("date", ">", oneMonthAgo));
        constraints.push(orderBy("votes", "desc"));
      }

      // Sort by user's posts
      if (filter.sortBy === SortOption.User) {
        if (user) {
          constraints.push(orderBy("date", "desc"));
          constraints.push(where("user.id", "==", user.id));
        } else {
          navigate(ROUTES.login);
        }
      }

      // Sort by unanswered posts
      if (filter.sortBy === SortOption.Unanswered) {
        constraints.push(orderBy("date", "desc"));
        constraints.push(where("commentsCount", "==", 0));
      }

      // If we already have a "lastDoc", we use startAfter() to get the next page
      if (lastFetchedPostDoc.current) {
        constraints.push(startAfter(lastFetchedPostDoc.current));
      }

      const snapshot = await getDocs(query(postsRef, ...constraints));

      if (!snapshot.empty) {
        // Save the last document from this snapshot; used in next fetch
        lastFetchedPostDoc.current = snapshot.docs[snapshot.docs.length - 1];

        // Map snapshot docs to ICommunityPost type
        const fetchedPosts: ICommunityPost[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<ICommunityPost, "id">;
          return { ...data, id: doc.id };
        });

        // If we get data equal to the the limit, we assume there's more data
        setHasMorePosts(fetchedPosts.length === fetchLimit);

        // Append new posts to existing state
        setPosts((prev) => [...prev, ...fetchedPosts]);
      } else {
        // If snapshot is empty, we assume there's no more data
        setHasMorePosts(false);
      }
    } catch (error) {
      toast("Can't proccess your request. Please try again!", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    } finally {
      setLoadingPosts(false);
    }
  }

  async function fetchPost(postId: string) {
    lastFetchedCommentDoc.current = null;
    setComments([]);
    const post = await getPost(postId);
    setPost(post);
    await fetchComments(postId);
  }

  async function getPost(postId: string): Promise<ICommunityPost | null> {
    setLoadingSinglePost(true);
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const data = postSnap.data() as Omit<ICommunityPost, "id">;
        return { ...data, id: postSnap.id };
      } else {
        toast("Post not found!", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
        return null;
      }
    } catch (error) {
      toast("Can't process your request. Please try again!", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
      return null;
    } finally {
      setLoadingSinglePost(false);
    }
  }

  async function fetchComments(postId: string) {
    setLoadingComments(true);

    try {
      // Reference the post document to get its comments subcollection
      const postRef = doc(db, "posts", postId);
      const commentsRef = collection(postRef, "comments");

      // Create query to get most recent x number of comments, ordered by 'date' descending
      // If we already have a "lastDoc", we use startAfter() to get the next page
      const commentsQuery = lastFetchedCommentDoc.current
        ? query(
            commentsRef,
            orderBy("date", "desc"),
            startAfter(lastFetchedCommentDoc.current),
            limit(fetchLimit),
          )
        : query(commentsRef, orderBy("date", "desc"), limit(fetchLimit));

      const snapshot = await getDocs(commentsQuery);

      if (!snapshot.empty) {
        // Save the last document from this snapshot; used in next fetch
        lastFetchedCommentDoc.current = snapshot.docs[snapshot.docs.length - 1];

        // Map snapshot docs to ICommunityComment type
        const fetchedComments: ICommunityComment[] = snapshot.docs.map(
          (doc) => {
            const data = doc.data() as Omit<ICommunityComment, "id">;
            return { ...data, id: doc.id };
          },
        );

        // If we get data equal to the the limit, we assume there's more data
        setHasMoreComments(fetchedComments.length === fetchLimit);

        // Append new comments to existing state
        setComments((prev) => [...prev, ...fetchedComments]);
      } else {
        // If snapshot is empty, we assume there's no more data
        setHasMoreComments(false);
      }
    } catch (error) {
      toast("Can't proccess your request. Please try again!", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    } finally {
      setLoadingComments(false);
    }
  }

  async function addPost(
    post: Omit<ICommunityPost, "id">,
  ): Promise<ICommunityPost> {
    // Firestore reference
    const postsRef = collection(db, "posts");

    // Add the document
    const docRef = await addDoc(postsRef, post);

    // Add the new post to the beginning of the list
    const newPost: ICommunityPost = {
      ...post,
      id: docRef.id,
      date: Timestamp.fromDate(new Date()),
      _highlightResult: undefined,
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);

    return newPost;
  }

  async function editPost(
    postId: string,
    updatedPostData: Partial<ICommunityPost>,
  ): Promise<ICommunityPost> {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Update the Firestore document
    await updateDoc(postDocRef, updatedPostData);

    // Update local state
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          // Merge the updated fields with the existing fields
          return { ...post, ...updatedPostData, _highlightResult: undefined };
        }
        return post;
      }),
    );

    const updatedPost: ICommunityPost = {
      ...posts.find((p) => p.id === postId)!,
      ...updatedPostData,
    };
    return updatedPost;
  }

  async function deletePost(postId: string): Promise<void> {
    try {
      // References to Firestore document
      const postDocRef = doc(db, "posts", postId);

      // Delete post's comments
      const colRef = collection(postDocRef, "comments");
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        let batch = writeBatch(db);
        let count = 0;

        for (const document of snapshot.docs) {
          // Add each delete operation to the batch
          batch.delete(doc(colRef, document.id));
          count++;

          // If we reach 100 deletes in this batch, commit and start a new batch
          if (count === 100) {
            await batch.commit();

            // Reset batch and counter
            batch = writeBatch(db);
            count = 0;
          }
        }
        if (count > 0) {
          await batch.commit();
        }
      }

      // Delete the post document
      await deleteDoc(postDocRef);

      // Update local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      if (post && post.id === postId) {
        setPost(undefined);
        setComments([]);
      }
    } catch (error) {
      toast("Failed to delete post", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    }
  }

  async function addComment(
    postId: string,
    comment: Omit<ICommunityComment, "id">,
  ): Promise<ICommunityComment> {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Reference to the comments sub-collection of the specific post
    const commentsRef = collection(postDocRef, "comments");

    // Add the new comment to the comments sub-collection
    const docRef = await addDoc(commentsRef, comment);

    // Add the new comment to the end of the list
    const newComment: ICommunityComment = {
      ...comment,
      id: docRef.id,
      date: Timestamp.fromDate(new Date()),
    };
    setComments((prevComments) => [...prevComments, newComment]);

    setPost((prevPost) => {
      if (prevPost?.id === postId) {
        return {
          ...prevPost,
          commentsCount: (prevPost.commentsCount || 0) + 1,
        };
      }
      return prevPost;
    });
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
          };
        }
        return post;
      }),
    );

    return newComment;
  }

  async function editComment(
    postId: string,
    commentId: string,
    updatedCommentData: Partial<ICommunityComment>,
  ): Promise<ICommunityComment> {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Reference to the comments sub-collection of the specific post
    const commentDocRef = doc(postDocRef, "comments", commentId);

    // Update the Firestore document
    await updateDoc(commentDocRef, updatedCommentData);

    // Update local state
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          // Merge the updated fields with the existing fields
          return { ...comment, ...updatedCommentData };
        }
        return comment;
      }),
    );

    const updatedComment: ICommunityComment = {
      ...comments.find((c) => c.id === commentId)!,
      ...updatedCommentData,
    };
    return updatedComment;
  }

  async function deleteComment(
    postId: string,
    commentId: string,
  ): Promise<void> {
    try {
      // References to Firestore documents
      const postDocRef = doc(db, "posts", postId);
      const commentDocRef = doc(postDocRef, "comments", commentId);

      // Delete the comment document
      await deleteDoc(commentDocRef);

      // Update local state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );

      setPost((prevPost) => {
        if (prevPost?.id === postId) {
          return {
            ...prevPost,
            commentsCount: Math.max((prevPost.commentsCount || 0) - 1, 0),
          };
        }
        return prevPost;
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: Math.max((post.commentsCount || 0) - 1, 0),
            };
          }
          return post;
        }),
      );
    } catch (error) {
      toast("Failed to delete comment", {
        action: {
          label: "Hide",
          onClick: () => {},
        },
      });
    }
  }

  async function reportPost(report: IReportPost): Promise<void> {
    // Firestore reference
    const postsRef = collection(db, "post_reports");

    // Add the document
    await addDoc(postsRef, report);
  }

  function updatePosts(hits: Hit<BaseHit>[]) {
    const _posts: ICommunityPost[] = hits.map((hit) => {
      return {
        id: hit.objectID,
        content: hit.content,
        votes: hit.votes,
        tags: hit.tags,
        user: hit.user,
        commentsCount: hit.commentsCount,
        hasBeenEdited: hit.hasBeenEdited,
        date: Timestamp.fromDate(new Date(Number(hit.date))),
        _highlightResult: hit._highlightResult,
      };
    });

    setPosts(_posts);
  }
  return (
    <CommunityContext.Provider
      value={{
        posts,
        updatePosts,
        resetPosts,
        loadingPosts,
        hasMorePosts,
        fetchPosts,
        post,
        getPost,
        fetchPost,
        loadingSinglePost,
        comments,
        fetchComments,
        loadingComments,
        hasMoreComments,
        addPost,
        editPost,
        deletePost,
        addComment,
        editComment,
        deleteComment,
        reportPost,
        filter,
        setFilter,
      }}
    >
      <ReportPostProvider>{children}</ReportPostProvider>
    </CommunityContext.Provider>
  );
}
