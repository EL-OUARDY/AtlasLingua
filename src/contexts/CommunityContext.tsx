import {
  ICommunityComment,
  ICommunityPost,
  IReportPost,
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
  increment,
  deleteDoc,
} from "firebase/firestore";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import ReportPostProvider from "./ReportPostContext";

interface ICommunityContext {
  posts: ICommunityPost[];
  loadingPosts: boolean;
  hasMorePosts: boolean;
  fetchPosts: () => Promise<void>;
  post: ICommunityPost | null | undefined;
  fetchPost: (postId: string) => Promise<void>;
  loadingSinglePost: boolean;
  comments: ICommunityComment[];
  fetchComments: (postId: string) => Promise<void>;
  loadingComments: boolean;
  hasMoreComments: boolean;
  addPost: (post: Omit<ICommunityPost, "id">) => Promise<ICommunityPost>;
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
export function CommunityProvider({ children, fetchLimit = 20 }: Props) {
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

  async function fetchPosts() {
    setLoadingPosts(true);

    try {
      const postsRef = collection(db, "posts");

      // Create query to get most recent x number of posts, ordered by 'date' descending
      // If we already have a "lastDoc", we use startAfter() to get the next page
      const postsQuery = lastFetchedPostDoc.current
        ? query(
            postsRef,
            orderBy("date", "desc"),
            startAfter(lastFetchedPostDoc.current),
            limit(fetchLimit),
          )
        : query(postsRef, orderBy("date", "desc"), limit(fetchLimit));

      const snapshot = await getDocs(postsQuery);

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
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    return newPost;
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

    // Increment commentsCount of target post
    await updateDoc(postDocRef, {
      commentsCount: increment(1),
    });

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

      // Decrement commentsCount of target post
      await updateDoc(postDocRef, {
        commentsCount: increment(-1),
      });

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

  return (
    <CommunityContext.Provider
      value={{
        posts,
        loadingPosts,
        hasMorePosts,
        fetchPosts,
        post,
        fetchPost,
        loadingSinglePost,
        comments,
        fetchComments,
        loadingComments,
        hasMoreComments,
        addPost,
        addComment,
        editComment,
        deleteComment,
        reportPost,
      }}
    >
      <ReportPostProvider>{children}</ReportPostProvider>
    </CommunityContext.Provider>
  );
}
