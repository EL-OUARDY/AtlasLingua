import {
  ICommunityComment,
  ICommunityFilter,
  ICommunityPost,
  INotificationSettings,
  IReportPost,
  SortOption,
} from "@/models/Community";
import { db } from "./firebaseConfig";
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
  setDoc,
} from "firebase/firestore";
import { IUser } from "@/models/User";

class communityService {
  async fetchPosts(
    user: IUser | undefined,
    filter: ICommunityFilter,
    fetchLimit: number,
    lastFetchedPostDoc: QueryDocumentSnapshot<
      DocumentData,
      DocumentData
    > | null,
  ) {
    // Reference posts collection
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
      constraints.push(orderBy("votesCount", "desc"));
    }

    // Sort by user's posts
    if (user && filter.sortBy === SortOption.User) {
      constraints.push(orderBy("date", "desc"));
      constraints.push(where("user.id", "==", user.id));
    }

    // Sort by unanswered posts
    if (filter.sortBy === SortOption.Unanswered) {
      constraints.push(orderBy("date", "desc"));
      constraints.push(where("commentsCount", "==", 0));
    }

    // If we already have a "lastDoc", we use startAfter() to get the next page
    if (lastFetchedPostDoc) {
      constraints.push(startAfter(lastFetchedPostDoc));
    }

    const snapshot = await getDocs(query(postsRef, ...constraints));

    // Map snapshot docs to ICommunityPost type
    const fetchedPosts: ICommunityPost[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<ICommunityPost, "id">;
      return { ...data, id: doc.id };
    });

    // Last document from this snapshot; used in next fetch
    const lastPost = snapshot.docs[snapshot.docs.length - 1];

    return {
      fetchedPosts,
      isEmpty: snapshot.empty,
      lastPost,
    };
  }

  async getPost(postId: string): Promise<ICommunityPost | null> {
    // Reference the post document
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const data = postSnap.data() as Omit<ICommunityPost, "id">;
      return { ...data, id: postSnap.id };
    } else {
      return null;
    }
  }

  async fetchComments(
    postId: string,
    lastFetchedCommentDoc: QueryDocumentSnapshot<
      DocumentData,
      DocumentData
    > | null,
    sortBy: "date" | "votes",
    fetchLimit: number,
  ) {
    // Reference the post document to get its comments subcollection
    const postRef = doc(db, "posts", postId);
    const commentsRef = collection(postRef, "comments");

    // Create query to get most recent x number of comments, ordered by 'date' ascending
    // If we already have a "lastDoc", we use startAfter() to get the next page
    const commentsQuery = lastFetchedCommentDoc
      ? query(
          commentsRef,
          ...(sortBy === "votes" ? [orderBy("votesCount", "desc")] : []),
          orderBy("date", "asc"),
          startAfter(lastFetchedCommentDoc),
          limit(fetchLimit),
        )
      : query(
          commentsRef,
          ...(sortBy === "votes" ? [orderBy("votesCount", "desc")] : []),
          orderBy("date", "asc"),
          limit(fetchLimit),
        );

    const snapshot = await getDocs(commentsQuery);

    // Map snapshot docs to ICommunityComment type
    const fetchedComments: ICommunityComment[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<ICommunityComment, "id">;
      return { ...data, id: doc.id };
    });

    // Last document from this snapshot; used in next fetch
    const lastComment = snapshot.docs[snapshot.docs.length - 1];

    return {
      fetchedComments,
      isEmpty: snapshot.empty,
      lastComment,
    };
  }

  async addPost(post: Omit<ICommunityPost, "id">) {
    // Firestore reference
    const postsRef = collection(db, "posts");

    // Add the document
    const docRef = await addDoc(postsRef, post);

    return docRef.id;
  }

  async editPost(postId: string, updatedPostData: Partial<ICommunityPost>) {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Update the Firestore document
    await updateDoc(postDocRef, updatedPostData);
  }

  async deletePost(postId: string) {
    // References to Firestore document
    const postDocRef = doc(db, "posts", postId);

    // Delete the post document
    await deleteDoc(postDocRef);
  }

  async addComment(postId: string, comment: Omit<ICommunityComment, "id">) {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Reference to the comments sub-collection of the specific post
    const commentsRef = collection(postDocRef, "comments");

    // Add the new comment to the comments sub-collection
    const docRef = await addDoc(commentsRef, comment);

    return docRef.id;
  }

  async editComment(
    postId: string,
    commentId: string,
    updatedCommentData: Partial<ICommunityComment>,
  ) {
    // Reference to the specific post document
    const postDocRef = doc(db, "posts", postId);

    // Reference to the comments sub-collection of the specific post
    const commentDocRef = doc(postDocRef, "comments", commentId);

    // Update the Firestore document
    await updateDoc(commentDocRef, updatedCommentData);
  }

  async deleteComment(postId: string, commentId: string) {
    // References to Firestore documents
    const postDocRef = doc(db, "posts", postId);
    const commentDocRef = doc(postDocRef, "comments", commentId);

    // Delete the comment document
    await deleteDoc(commentDocRef);
  }

  async reportPost(report: IReportPost) {
    // Firestore reference
    const postsRef = collection(db, "post_reports");

    // Add the document
    await addDoc(postsRef, report);
  }

  async votePost(post: ICommunityPost, userId: number) {
    const voteRef = doc(db, `posts/${post.id}/votes/${userId}`);
    // UpVote
    if (!post.isUpVoted) await setDoc(voteRef, { userId: userId.toString() });
    // DownVote
    else await deleteDoc(voteRef);
  }

  async hasUserVotedOnPost(postId: string, userId: number) {
    // Reference the votes document
    const voteDocRef = doc(db, `posts/${postId}/votes/${userId}`);
    const docSnap = await getDoc(voteDocRef);
    return docSnap.exists();
  }

  async voteComment(
    comment: ICommunityComment,
    postId: string,
    userId: number,
  ) {
    const voteRef = doc(
      db,
      `posts/${postId}/comments/${comment.id}/votes/${userId}`,
    );

    // UpVote
    if (!comment.isUpVoted)
      await setDoc(voteRef, { userId: userId.toString() });
    // DownVote
    else await deleteDoc(voteRef);
  }

  async hasUserVotedOnComment(
    commentId: string,
    postId: string,
    userId: number,
  ) {
    // Reference the votes document
    const voteDocRef = doc(
      db,
      `posts/${postId}/comments/${commentId}/votes/${userId}`,
    );
    const docSnap = await getDoc(voteDocRef);
    return docSnap.exists();
  }

  async getNotificationSettings(
    userId: number,
  ): Promise<INotificationSettings | undefined> {
    // Reference to the user's notification settings
    const ref = doc(db, `users/${userId}/notification_settings/${userId}`);

    // Get document
    const postSnap = await getDoc(ref);
    return postSnap.data() as INotificationSettings | undefined;
  }

  async saveNotificationSettings(
    settings: INotificationSettings,
    userId: number,
  ) {
    // Reference to the user's notification settings
    const ref = doc(db, `users/${userId}/notification_settings/${userId}`);

    // Add the notification object to the document
    await setDoc(ref, settings);
  }
}

export default new communityService();
