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
  Timestamp,
} from "firebase/firestore";

interface CommentInput {
  blogId: string;
  blogTitle: string;
  content: string;
  userId: string;
  userName: string;
}

// Helper function to properly serialize Firestore data
function serializeComment(doc: any): CommentT {
  const data = doc.data();

  // Handle Firestore Timestamp properly
  let createdAt: Date | string;
  if (data.createdAt instanceof Timestamp) {
    createdAt = data.createdAt.toDate().toISOString();
  } else if (data.createdAt) {
    createdAt = new Date(data.createdAt).toISOString();
  } else {
    createdAt = new Date().toISOString();
  }

  return {
    id: doc.id,
    blogId: data.blogId || "",
    blogTitle: data.blogTitle || "",
    content: data.content || "",
    userId: data.userId || "",
    userName: data.userName || "",
    createdAt,
  };
}

export async function addComment(input: CommentInput) {
  try {
    const commentData = {
      blogId: input.blogId,
      blogTitle: input.blogTitle,
      content: input.content,
      userId: input.userId,
      userName: input.userName,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "comments"), commentData);

    // Return a plain object with serialized date
    return {
      id: docRef.id,
      ...commentData,
      createdAt: new Date().toISOString(), // Use current date since serverTimestamp is not available client-side
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

export async function getComments(blogId: string) {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("blogId", "==", blogId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const comments: CommentT[] = [];

    querySnapshot.forEach((doc) => {
      comments.push(serializeComment(doc));
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}
