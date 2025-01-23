import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";

// Initialize Firebase Admin
initializeApp();

// Get Firestore instance
const db = getFirestore();

interface IMetadata {
  votesCount: number;
  commentsCount?: number;
  date: Timestamp;
  hasBeenEdited: boolean;
}

// Listens for new post added to /posts/{postId}
exports.onPostCreated = onDocumentCreated("/posts/{postId}", (event) => {
  if (!event.data) return null;

  // Initial metadata
  const metadata: IMetadata = {
    commentsCount: 0,
    date: Timestamp.now(),
    hasBeenEdited: false,
    votesCount: 0,
  };

  // Set post metadata
  return event.data.ref.set(metadata, { merge: true });
});

// Listens for post deleted to /posts/{postId}
exports.onPostDeleted = onDocumentDeleted("/posts/{postId}", async (event) => {
  if (!event.data) return null;

  // Get reference to the comments collection of deleted post
  const postId = event.params.postId;
  const commentsRef = db.collection(`posts/${postId}/comments`);

  // Get all comments in the post
  const commentsSnapshot = await commentsRef.get();

  // If there are no comments, return early
  if (commentsSnapshot.empty) return null;

  // Create a batch operation
  const batch = db.batch();

  // Add each comment deletion to the batch
  commentsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Execute all deletions in a single atomic operation
  return batch.commit();
});

// Listens for new comment added to /posts/{postId}/comments/{commentId}
exports.onCommentCreated = onDocumentCreated(
  "/posts/{postId}/comments/{commentId}",
  async (event) => {
    if (!event.data) return null;

    // Initial metadata for the comment
    const metadata: IMetadata = {
      votesCount: 0,
      date: Timestamp.now(),
      hasBeenEdited: false,
    };

    // Get reference to the parent post document
    const postRef = event.data.ref.parent.parent;

    if (!postRef) return null;

    // Create a batch to handle both operations atomically
    const batch = event.data.ref.firestore.batch();

    // Set comment metadata
    batch.set(event.data.ref, metadata, { merge: true });

    // Increment the commentsCount of the parent post
    batch.update(postRef, {
      commentsCount: FieldValue.increment(1),
    });

    // Commit the batch
    return batch.commit();
  },
);

// Listens for comment deleted to /posts/{postId}/comments/{commentId}
exports.onCommentDeleted = onDocumentDeleted(
  "/posts/{postId}/comments/{commentId}",
  async (event) => {
    if (!event.data) return null;

    // Get reference to the parent post document
    const postRef = event.data.ref.parent.parent;
    if (!postRef) return null;

    // Update the post document
    return postRef.update({
      commentsCount: FieldValue.increment(-1),
    });
  },
);
