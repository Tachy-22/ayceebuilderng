"use server";

import { getCollection, isFirebaseError, QueryFilter, QueryOrder } from "@/lib/firebase-utils";

export type QueryOptions = {
  whereClause?: [
    string,
    "<" | "<=" | "==" | ">=" | ">",
    string | number | boolean
  ][];
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  limitTo?: number;
};

export type FirebaseError = {
  code: string;
  message: string;
};

export async function fetchCollection<T>(
  collectionName: string,
  options?: QueryOptions
): Promise<{ items: T[]; count: number } | FirebaseError> {
  try {
    if (!collectionName) {
      throw new Error("Collection name is required");
    }

    // Convert legacy options format to new format
    const filters: QueryFilter[] = options?.whereClause?.map(([field, operator, value]) => ({
      field,
      operator: operator as any, // Firebase operators match the legacy ones
      value
    })) || [];

    const orderBy: QueryOrder[] = options?.orderByField ? [{
      field: options.orderByField,
      direction: options.orderDirection || "asc"
    }] : [];

    const result = await getCollection<T>(collectionName, {
      filters,
      orderBy,
      limit: options?.limitTo
    });

    if (isFirebaseError(result)) {
      return {
        code: result.code || "fetch-collection-error",
        message: result.error
      };
    }

    return { items: result.data, count: result.data.length };
  } catch (error) {
    return {
      code: "fetch-collection-error",
      message:
        error instanceof Error ? error.message : "Failed to fetch collection",
    };
  }
}
