"use server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export type FirebaseError = {
  code: string;
  message: string;
  success: boolean;
};

export async function addDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T,
  path: string
): Promise<{ id: string; success: true } | FirebaseError> {
  try {
    console.log({ collectionName, data, path });

    if (!collectionName || !data) {
      throw new Error("Missing required parameters");
    }

    const collectionRef = collection(db, collectionName);

    // Make sure createdAt exists and is a proper timestamp
    const docData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collectionRef, docData);

    // Revalidate the path to update any cached data
    revalidatePath(path);

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error adding document:", error);
    return {
      code: "add-document-error",
      message:
        error instanceof Error ? error.message : "Failed to add document",
      success: false,
    };
  }
}
