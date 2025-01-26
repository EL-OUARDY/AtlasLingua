/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICommunityComment,
  ICommunityFilter,
  ICommunityPost,
  IReportPost,
  SortOption,
} from "@/models/Community";

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
import communityService from "@/services/communityService";
import { Timestamp } from "firebase/firestore";
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
  votePost: (_post: ICommunityPost) => void;
  hasUserVotedOnPost: (postId: string) => Promise<boolean | undefined>;
  voteComment: (comment: ICommunityComment, postId: string) => void;
  hasUserVotedOnComment: (
    commentId: string,
    postId: string,
  ) => Promise<boolean | undefined>;
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
  // Store the last fetched post to implement pagination
  const lastFetchedPost = useRef<any>(null);

  const [post, setPost] = useState<ICommunityPost | null>();
  const [loadingSinglePost, setLoadingSinglePost] = useState<boolean>(true);
  const [comments, setComments] = useState<ICommunityComment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  // Store the last fetched comment to implement pagination
  const lastFetchedComment = useRef<any>(null);

  const [filter, setFilter] = useState<ICommunityFilter>({
    searchQuery: "",
    sortBy: "latest",
  });

  const navigate = useNavigate();

  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    resetPosts();
    setFilter({
      ...filter,
      searchQuery: "",
    });

    if (filter.sortBy === SortOption.User) {
      if (!user) {
        navigate(ROUTES.login);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.sortBy]);

  function resetPosts() {
    lastFetchedPost.current = null;
    setPosts([]);
    fetchPosts();
  }

  async function fetchPosts() {
    try {
      setLoadingPosts(true);

      // Get posts
      const { fetchedPosts, lastPost, isEmpty } =
        await communityService.fetchPosts(
          user,
          filter,
          fetchLimit,
          lastFetchedPost?.current || null,
        );

      if (!isEmpty) {
        // Save the last fetched post; used in next fetch
        lastFetchedPost.current = lastPost;

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
    lastFetchedComment.current = null;
    setComments([]);
    const post = await getPost(postId);
    setPost(post);
    await fetchComments(postId);
  }

  async function getPost(postId: string): Promise<ICommunityPost | null> {
    try {
      setLoadingSinglePost(true);
      const post = await communityService.getPost(postId);

      if (!post) {
        toast("Post not found!", {
          action: {
            label: "Hide",
            onClick: () => {},
          },
        });
      }
      return post;
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
    try {
      setLoadingComments(true);
      // Get comments
      const { fetchedComments, lastComment, isEmpty } =
        await communityService.fetchComments(
          postId,
          lastFetchedComment?.current || null,
          fetchLimit,
        );

      if (!isEmpty) {
        // Save the last fetched comment; used in next fetch
        lastFetchedComment.current = lastComment;

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
    try {
      // Add post
      const id = await communityService.addPost(post);

      // Add the new post to the beginning of the list
      const newPost: ICommunityPost = {
        ...post,
        id: id,
        date: Timestamp.fromDate(new Date()),
        _highlightResult: undefined,
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      return newPost;
    } catch (error) {
      console.error("Failed to add post:", error);
      throw error;
    }
  }

  async function editPost(
    postId: string,
    updatedPostData: Partial<ICommunityPost>,
  ): Promise<ICommunityPost> {
    try {
      // Update post
      await communityService.editPost(postId, updatedPostData);

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
    } catch (error) {
      console.error("Failed to update post:", error);
      throw error;
    }
  }

  async function deletePost(postId: string): Promise<void> {
    try {
      // Delete post
      await communityService.deletePost(postId);

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
    try {
      // Add the new comment
      const id = await communityService.addComment(postId, comment);

      // Add the new comment to the end of the list
      const newComment: ICommunityComment = {
        ...comment,
        id: id,
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
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  }

  async function editComment(
    postId: string,
    commentId: string,
    updatedCommentData: Partial<ICommunityComment>,
  ): Promise<ICommunityComment> {
    try {
      // Edit comment
      await communityService.editComment(postId, commentId, updatedCommentData);

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
    } catch (error) {
      console.error("Failed to update comment:", error);
      throw error;
    }
  }

  async function deleteComment(
    postId: string,
    commentId: string,
  ): Promise<void> {
    try {
      // Delete comment
      await communityService.deleteComment(postId, commentId);

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
    await communityService.reportPost(report);
  }

  function updatePosts(hits: Hit<BaseHit>[]) {
    const _posts: ICommunityPost[] = hits.map((hit) => {
      return {
        id: hit.objectID,
        content: hit.content,
        votesCount: hit.votesCount,
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

  async function votePost(_post: ICommunityPost) {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      await communityService.votePost(_post, user.id as number);

      // UpVote
      if (!_post.isUpVoted) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === _post.id) {
              return {
                ...p,
                votesCount: Math.max((p.votesCount || 0) + 1, 0),
                isUpVoted: true,
              };
            }
            return p;
          }),
        );
        if (post && post.id === _post.id)
          setPost({
            ...post,
            votesCount: Math.max((post.votesCount || 0) + 1, 0),
            isUpVoted: true,
          });
      }
      // DownVote
      else {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === _post.id) {
              return {
                ...p,
                votesCount: Math.max((p.votesCount || 0) - 1, 0),
                isUpVoted: false,
              };
            }
            return p;
          }),
        );
        if (post && post.id === _post.id)
          setPost({
            ...post,
            votesCount: Math.max((post.votesCount || 0) - 1, 0),
            isUpVoted: false,
          });
      }
    } catch (error) {
      console.error("Operation failed", error);
      throw error;
    }
  }

  async function hasUserVotedOnPost(
    postId: string,
  ): Promise<boolean | undefined> {
    if (!user || !isAuthenticated) {
      return;
    }
    try {
      const exist = await communityService.hasUserVotedOnPost(
        postId,
        user.id as number,
      );

      // Update posts
      if (exist) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) return { ...p, isUpVoted: true };
            return p;
          }),
        );

        // Update post
        if (post && post.id === postId) setPost({ ...post, isUpVoted: true });
      }

      return exist;
    } catch (error) {
      return false;
    }
  }

  async function voteComment(comment: ICommunityComment, postId: string) {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      await communityService.voteComment(comment, postId, user.id as number);

      // UpVote
      if (!comment.isUpVoted) {
        setComments((prevComments) =>
          prevComments.map((p) => {
            if (p.id === comment.id) {
              return {
                ...p,
                votesCount: Math.max((p.votesCount || 0) + 1, 0),
                isUpVoted: true,
              };
            }
            return p;
          }),
        );
      }
      // DownVote
      else {
        setComments((prevComments) =>
          prevComments.map((p) => {
            if (p.id === comment.id) {
              return {
                ...p,
                votesCount: Math.max((p.votesCount || 0) - 1, 0),
                isUpVoted: false,
              };
            }
            return p;
          }),
        );
      }
    } catch (error) {
      console.error("Operation failed", error);
      throw error;
    }
  }

  async function hasUserVotedOnComment(
    commentId: string,
    postId: string,
  ): Promise<boolean | undefined> {
    if (!user || !isAuthenticated) {
      return;
    }
    try {
      const exist = await communityService.hasUserVotedOnComment(
        commentId,
        postId,
        user.id as number,
      );

      // Update comments
      if (exist) {
        setComments((prevComments) =>
          prevComments.map((c) => {
            if (c.id === commentId) return { ...c, isUpVoted: true };
            return c;
          }),
        );
      }

      return exist;
    } catch (error) {
      return false;
    }
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
        votePost,
        hasUserVotedOnPost,
        voteComment,
        hasUserVotedOnComment,
      }}
    >
      <ReportPostProvider>{children}</ReportPostProvider>
    </CommunityContext.Provider>
  );
}
