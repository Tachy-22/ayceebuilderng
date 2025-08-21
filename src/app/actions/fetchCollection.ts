"use server";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  WhereFilterOp,
  DocumentData,
  Query,
  OrderByDirection,
  startAfter,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type FirebaseError = {
  code: string;
  message: string;
  success: boolean;
};

type FilterType = {
  field: string;
  operator: WhereFilterOp;
  value: any;
};

type OrderByType = {
  field: string;
  direction: OrderByDirection;
};

type FetchOptions = {
  filters?: FilterType[];
  orderBy?: OrderByType[];
  limitTo?: number;
  startAfterDoc?: QuerySnapshot<DocumentData>;
};

export async function fetchCollection<T>(
  collectionName: string,
  options?: FetchOptions
): Promise<T[]> {
  try {
    if (!collectionName) {
      throw new Error("Missing collection name");
    }

    if (!db) {
      throw new Error("Database not initialized");
    }

    const collectionRef = collection(db, collectionName);
    let queryConstraints = [];

    // Add where filters
    if (options?.filters && options.filters.length > 0) {
      options.filters.forEach((filter) => {
        queryConstraints.push(
          where(filter.field, filter.operator, filter.value)
        );
      });
    }

    // Add orderBy
    if (options?.orderBy && options.orderBy.length > 0) {
      options.orderBy.forEach((order) => {
        queryConstraints.push(orderBy(order.field, order.direction));
      });
    }

    // Add limit
    if (options?.limitTo) {
      queryConstraints.push(limit(options.limitTo));
    }

    // Add pagination
    if (options?.startAfterDoc) {
      queryConstraints.push(startAfter(options.startAfterDoc));
    }

    const q =
      queryConstraints.length > 0
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as T)
    );
  } catch (error) {
    console.error("Error fetching collection:", error);
    // Return empty array instead of throwing to allow for graceful error handling
    return [];
  }
}
