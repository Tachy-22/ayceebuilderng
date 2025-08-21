"use server";
import { getCollection, isFirebaseError, QueryFilter, QueryOrder } from "@/lib/firebase-utils";

type FirebaseError = {
  code: string;
  message: string;
  success: boolean;
};

type FetchOptions = {
  filters?: QueryFilter[];
  orderBy?: QueryOrder[];
  limit?: number;
  // Note: Removed startAfterDoc as it's complex and not implemented in firebase-utils yet
};

export async function fetchCollection<T>(
  collectionName: string,
  options?: FetchOptions
): Promise<T[]> {
  try {
    if (!collectionName) {
      throw new Error("Missing collection name");
    }

    const result = await getCollection<T>(collectionName, {
      filters: options?.filters,
      orderBy: options?.orderBy,
      limit: options?.limit
    });

    if (isFirebaseError(result)) {
      console.error("Error fetching collection:", result.error);
      // Return empty array instead of throwing to allow for graceful error handling
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching collection:", error);
    // Return empty array instead of throwing to allow for graceful error handling
    return [];
  }
}
