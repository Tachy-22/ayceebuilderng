"use server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FirebaseError = {
  code: string;
  message: string;
  success: boolean;
};

export async function fetchDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  try {
    if (!collectionName || !documentId) {
      throw new Error("Missing required parameters");
    }

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as T;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}
