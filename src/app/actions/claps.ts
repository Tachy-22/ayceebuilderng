"use server";

import { 
  addDocument, 
  getCollection, 
  getDocument, 
  updateDocument, 
  isFirebaseError 
} from "@/lib/firebase-utils";

// Add claps to a blog post
export async function addClap(
  blogId: string,
  visitorId: string,
  count: number = 1
): Promise<{ success: boolean; totalClaps?: number; error?: string }> {
  try {
    // Validate clap count (prevent excessive claps at once)
    if (count < 1 || count > 50) {
      return { success: false, error: "Invalid clap count" };
    }

    // Check if the visitor already clapped for this blog
    const clapsResult = await getCollection("claps", {
      filters: [
        { field: "blogId", operator: "==", value: blogId },
        { field: "visitorId", operator: "==", value: visitorId }
      ]
    });

    if (isFirebaseError(clapsResult)) {
      return { success: false, error: clapsResult.error };
    }

    if (clapsResult.data.length === 0) {
      // First time clapping, create new document
      const addResult = await addDocument("claps", {
        blogId,
        visitorId,
        count,
      });

      if (isFirebaseError(addResult)) {
        return { success: false, error: addResult.error };
      }
    } else {
      // Already clapped before, update the count
      const clapDoc = clapsResult.data[0];
      const currentCount = (clapDoc as any).count || 0;
      
      const updateResult = await updateDocument("claps", clapDoc.id, {
        count: currentCount + count,
      });

      if (isFirebaseError(updateResult)) {
        return { success: false, error: updateResult.error };
      }
    }

    // Update the total claps on the blog document
    const blogResult = await getDocument("blogs", blogId);

    if (isFirebaseError(blogResult)) {
      return { success: false, error: blogResult.error };
    }

    if (blogResult.data) {
      const currentClaps = (blogResult.data as any).claps || 0;
      const newClaps = currentClaps + count;

      const updateBlogResult = await updateDocument("blogs", blogId, {
        claps: newClaps,
      });

      if (isFirebaseError(updateBlogResult)) {
        return { success: false, error: updateBlogResult.error };
      }

      return { success: true, totalClaps: newClaps };
    }

    return { success: false, error: "Blog not found" };
  } catch (error) {
    console.error("Error adding claps:", error);
    return { success: false, error: "Failed to add claps" };
  }
}

// Get the total claps for a blog post
export async function getClaps(blogId: string): Promise<number> {
  try {
    const blogResult = await getDocument("blogs", blogId);

    if (isFirebaseError(blogResult)) {
      console.error("Error getting claps:", blogResult.error);
      return 0;
    }

    if (blogResult.data) {
      return (blogResult.data as any).claps || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error getting claps:", error);
    return 0;
  }
}

// Get visitor's clap count for a blog
export async function getVisitorClaps(
  blogId: string,
  visitorId: string
): Promise<number> {
  try {
    const clapsResult = await getCollection("claps", {
      filters: [
        { field: "blogId", operator: "==", value: blogId },
        { field: "visitorId", operator: "==", value: visitorId }
      ]
    });

    if (isFirebaseError(clapsResult)) {
      console.error("Error getting visitor claps:", clapsResult.error);
      return 0;
    }

    if (clapsResult.data.length > 0) {
      return (clapsResult.data[0] as any).count || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error getting visitor claps:", error);
    return 0;
  }
}
