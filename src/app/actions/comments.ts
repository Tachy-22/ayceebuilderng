"use server";

import { 
  addDocument, 
  getCollection, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  isFirebaseError 
} from "@/lib/firebase-utils";
import { CommentT } from "@/lib/types/blog";

// Add a new comment
export async function addComment(
  blogId: string,
  content: string,
  author: string,
  userId: string,
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

    // Create the comment object
    const commentData = {
      blogId,
      content: content.trim(),
      author: author.trim(),
      userId, // Using userId instead of email
      visitorId,
      likes: 0,
      ...(parentId && { parentId }),
    };

    // Add to Firestore
    const result = await addDocument("comments", commentData);

    if (isFirebaseError(result)) {
      return { success: false, error: result.error };
    }

    // Return the created comment with its ID
    return {
      success: true,
      comment: {
        id: result.data.id,
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
    const result = await getCollection<CommentT>("comments", {
      filters: [{ field: "blogId", operator: "==", value: blogId }],
      orderBy: [{ field: "createdAt", direction: "desc" }]
    });

    if (isFirebaseError(result)) {
      console.error("Error fetching comments:", result.error);
      return [];
    }

    // Convert timestamps to ISO strings for serialization
    const comments = result.data.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt instanceof Date 
        ? comment.createdAt.toISOString()
        : typeof comment.createdAt === 'string'
        ? comment.createdAt
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
    const likesResult = await getCollection("likes", {
      filters: [
        { field: "targetId", operator: "==", value: commentId },
        { field: "visitorId", operator: "==", value: visitorId }
      ]
    });

    if (isFirebaseError(likesResult)) {
      return { success: false, error: likesResult.error };
    }

    // If already liked, remove the like
    if (likesResult.data.length > 0) {
      // Get the first like document
      const likeDoc = likesResult.data[0];

      // Remove the like
      const deleteResult = await deleteDocument("likes", likeDoc.id);
      if (isFirebaseError(deleteResult)) {
        return { success: false, error: deleteResult.error };
      }

      // Get current comment to calculate new likes count
      const commentResult = await getDocument("comments", commentId);
      if (isFirebaseError(commentResult)) {
        return { success: false, error: commentResult.error };
      }

      if (commentResult.data) {
        const currentLikes = (commentResult.data as any).likes || 0;
        const updateResult = await updateDocument("comments", commentId, {
          likes: Math.max(0, currentLikes - 1)
        });
        
        if (isFirebaseError(updateResult)) {
          return { success: false, error: updateResult.error };
        }
      }

      return { success: true };
    }

    // Add new like
    const addLikeResult = await addDocument("likes", {
      targetId: commentId,
      visitorId,
    });

    if (isFirebaseError(addLikeResult)) {
      return { success: false, error: addLikeResult.error };
    }

    // Get current comment to calculate new likes count
    const commentResult = await getDocument("comments", commentId);
    if (isFirebaseError(commentResult)) {
      return { success: false, error: commentResult.error };
    }

    if (commentResult.data) {
      const currentLikes = (commentResult.data as any).likes || 0;
      const updateResult = await updateDocument("comments", commentId, {
        likes: currentLikes + 1
      });
      
      if (isFirebaseError(updateResult)) {
        return { success: false, error: updateResult.error };
      }
    }

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
    const commentResult = await getDocument("comments", commentId);

    if (isFirebaseError(commentResult)) {
      return { success: false, error: commentResult.error };
    }

    if (!commentResult.data) {
      return { success: false, error: "Comment not found" };
    }

    const commentData = commentResult.data as any;

   // console.log("Server received request to delete comment:");
   // console.log("Comment ID:", commentId);
   // console.log("Provided visitorId:", visitorId);
   // console.log("Comment visitorId:", commentData.visitorId);
   // console.log("Comment userId:", commentData.userId);

    // Server-side check - compare both userId and visitorId
    const isAuthor =
      commentData.visitorId === visitorId || commentData.userId === visitorId;

    if (!isAuthor) {
      return {
        success: false,
        error: "You can only delete your own comments",
      };
    }

    // Delete the comment
    const deleteResult = await deleteDocument("comments", commentId);
    
    if (isFirebaseError(deleteResult)) {
      return { success: false, error: deleteResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
