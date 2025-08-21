"use server";

import { addDocument, getCollection, isFirebaseError } from "@/lib/firebase-utils";

interface CommentInput {
  blogId: string;
  blogTitle: string;
  content: string;
  userId: string;
  userName: string;
}

interface CommentT {
  id: string;
  blogId: string;
  blogTitle: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export async function addComment(input: CommentInput) {
  try {
    const commentData = {
      blogId: input.blogId,
      blogTitle: input.blogTitle,
      content: input.content,
      userId: input.userId,
      userName: input.userName,
    };

    const result = await addDocument("comments", commentData);

    if (isFirebaseError(result)) {
      throw new Error(result.error);
    }

    // Return a plain object with serialized date
    return {
      id: result.data.id,
      ...commentData,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

export async function getComments(blogId: string) {
  try {
    const result = await getCollection<CommentT>("comments", {
      filters: [{ field: "blogId", operator: "==", value: blogId }],
      orderBy: [{ field: "createdAt", direction: "desc" }]
    });

    if (isFirebaseError(result)) {
      console.error("Error fetching comments:", result.error);
      return [];
    }

    // Ensure createdAt is properly serialized - data from Firebase utilities should already be serialized
    return result.data.map(comment => ({
      ...comment,
      createdAt: typeof comment.createdAt === 'string'
        ? comment.createdAt
        : new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
