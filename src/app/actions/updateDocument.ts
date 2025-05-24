"use server";

import { db } from "@/lib/firebase-server";
import { doc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "./addDocument";
import { revalidatePath } from "next/cache";

export async function updateDocument<T extends { [key: string]: unknown }>(
  collectionName: string,
  documentId: string,
  data: Partial<T>,
  path: string
): Promise<{ id: string; success: boolean } | FirebaseError> {
  try {
    if (!collectionName || !documentId || !data) {
      throw new Error("Missing required parameters");
    }

    const docRef = doc(db, collectionName, documentId);

    // Make sure updatedAt is a proper timestamp
    const updateData = {
      ...data,      updatedAt: new Date(),
    };

    await updateDoc(docRef, updateData);

    // Revalidate the path to update any cached data
    revalidatePath(path);

    return { id: documentId, success: true };
  } catch (error) {
    console.error("Error updating document:", error);
    return {
      code: "update-document-error",
      message:
        error instanceof Error ? error.message : "Failed to update document",
      success: false,
    };
  }
}
