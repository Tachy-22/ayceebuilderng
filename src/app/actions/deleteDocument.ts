"use server";

import { doc, deleteDoc, getDoc, getFirestore } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { FirebaseError } from "./addDocument";
import { revalidatePath } from "next/cache";
import { deleteObject, ref } from "firebase/storage";
import { deleteCloudinaryImage } from "./deleteCloudinaryImage";

export async function deleteDocument(
  collectionName: string,
  documentId: string,
  path: string
): Promise<{ success: true; message: string } | FirebaseError> {
  try {
    if (!collectionName || !documentId) {
      throw new Error(
        "Missing required parameters: collection name or document ID"
      );
    }

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(
        `Document with ID ${documentId} does not exist in ${collectionName} collection`
      );
    }



    // Delete the document
    await deleteDoc(docRef);

    // Revalidate the path to update UI
    if (path) {
      revalidatePath(path);
    }

    return {
      success: true,
      message: `Document ${documentId} successfully deleted from ${collectionName}`,
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      success: false,

      code: "delete-document-error",
      message:
        error instanceof Error
          ? `Failed to delete document: ${error.message}`
          : "Failed to delete document due to an unknown error",
    };
  }
}
