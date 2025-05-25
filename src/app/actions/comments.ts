"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { CommentT } from "@/lib/types/blog";

// Add a new comment
export async function addComment(
  blogId: string,
  content: string,
  author: string,
  email: string,
  visitorId: string,
  parentId?: string
): Promise<{ success: boolean; comment?: CommentT; error?: string }> {
  try {
    // Basic validation
    if (!content.trim()) {
      return { success: false, error: "Comment content cannot be empty" };
    }
    if (!author.trim()) {
      return { success: false, error: "Name cannot be empty" };
    }
    if (!email.trim() || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email" };
    }

    // Create the comment object
    const commentData = {
      blogId,
      content: content.trim(),
      author: author.trim(),
      email: email.trim(),
      visitorId,
      createdAt: serverTimestamp(),
      likes: 0,
      ...(parentId && { parentId }),
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, "comments"), commentData);

    // Return the created comment with its ID
    return {
      success: true,
      comment: {
        id: docRef.id,
        ...commentData,
        // Convert timestamp to a serializable format for the client
        createdAt: new Date().toISOString(),
      } as CommentT,
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

// Get comments for a blog post
export async function getComments(blogId: string): Promise<CommentT[]> {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("blogId", "==", blogId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string for serialization
      createdAt: doc.data().createdAt?.toDate?.()
        ? doc.data().createdAt.toDate().toISOString()
        : new Date().toISOString(),
    })) as CommentT[];

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Like a comment
export async function likeComment(
  commentId: string,
  visitorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the visitor already liked this comment
    const likesRef = collection(db, "likes");
    const q = query(
      likesRef,
      where("targetId", "==", commentId),
      where("visitorId", "==", visitorId)
    );

    const querySnapshot = await getDocs(q);

    // If already liked, remove the like
    if (!querySnapshot.empty) {
      // Get the first like document
      const likeDoc = querySnapshot.docs[0];

      // Remove the like
      await deleteDoc(doc(db, "likes", likeDoc.id));

      // Decrement the likes count on the comment
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        likes: increment(-1),
      });

      return { success: true };
    }

    // Add new like
    await addDoc(collection(db, "likes"), {
      targetId: commentId,
      visitorId,
      createdAt: serverTimestamp(),
    });

    // Increment the likes count on the comment
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      likes: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Error liking comment:", error);
    return { success: false, error: "Failed to like comment" };
  }
}

// Delete a comment (only allow if it's the same visitor)
export async function deleteComment(
  commentId: string,
  visitorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify this visitor is the comment author
    const commentRef = doc(db, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      return { success: false, error: "Comment not found" };
    }

    const commentData = commentSnap.data();
    if (commentData.visitorId !== visitorId) {
      return { success: false, error: "You can only delete your own comments" };
    }

    // Delete the comment
    await deleteDoc(commentRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
