"use server";
import { addDocument as addDoc, isFirebaseError } from "@/lib/firebase-utils";
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

    const result = await addDoc(collectionName, data);

    if (isFirebaseError(result)) {
      return {
        code: result.code || "add-document-error",
        message: result.error,
        success: false,
      };
    }

    // Revalidate the path to update any cached data
    revalidatePath(path);

    return { id: result.data.id, success: true };
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
