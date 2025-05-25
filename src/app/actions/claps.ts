"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  getDoc,
} from "firebase/firestore";

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
    const clapsRef = collection(db, "claps");
    const q = query(
      clapsRef,
      where("blogId", "==", blogId),
      where("visitorId", "==", visitorId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // First time clapping, create new document
      await addDoc(collection(db, "claps"), {
        blogId,
        visitorId,
        count,
        createdAt: serverTimestamp(),
      });
    } else {
      // Already clapped before, update the count
      const clapDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "claps", clapDoc.id), {
        count: increment(count),
      });
    }

    // Update the total claps on the blog document
    const blogRef = doc(db, "blogs", blogId);
    const blogDoc = await getDoc(blogRef);

    if (blogDoc.exists()) {
      const currentClaps = blogDoc.data().claps || 0;
      const newClaps = currentClaps + count;

      await updateDoc(blogRef, {
        claps: newClaps,
      });

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
    const blogRef = doc(db, "blogs", blogId);
    const blogDoc = await getDoc(blogRef);

    if (blogDoc.exists()) {
      return blogDoc.data().claps || 0;
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
    const clapsRef = collection(db, "claps");
    const q = query(
      clapsRef,
      where("blogId", "==", blogId),
      where("visitorId", "==", visitorId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().count || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error getting visitor claps:", error);
    return 0;
  }
}
