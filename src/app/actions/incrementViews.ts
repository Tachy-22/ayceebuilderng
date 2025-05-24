"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function incrementViews(
  blogId: string,
  path?: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!blogId) {
      throw new Error("Blog ID is required");
    }

    const docRef = doc(db, "blogs", blogId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Blog with ID ${blogId} does not exist`);
    }

    // Increment the views counter
    await updateDoc(docRef, {
      views: increment(1),
      updatedAt: new Date().toISOString(),
    });

    // Revalidate the path if provided
    if (path) {
      revalidatePath(path);
    }

    return {
      success: true,
      message: "View count incremented successfully",
    };
  } catch (error) {
    console.error("Error incrementing views:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to increment view count",
    };
  }
}
