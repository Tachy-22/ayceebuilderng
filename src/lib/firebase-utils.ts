
// Firebase utilities for server-side operations
import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

export type FirebaseUtilsError = {
  success: false;
  error: string;
  code?: string;
};

export type FirebaseUtilsSuccess<T = any> = {
  success: true;
  data: T;
};

export type FirebaseUtilsResult<T = any> = FirebaseUtilsSuccess<T> | FirebaseUtilsError;

// Document operations
export async function getDocument<T = any>(
  collectionName: string,
  documentId: string
): Promise<FirebaseUtilsResult<T | null>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        id: docSnap.id,
        ...docSnap.data()
      } as T
    };
  } catch (error) {
    console.error('Error getting document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'GET_DOCUMENT_ERROR'
    };
  }
}

export async function addDocument<T = any>(
  collectionName: string,
  data: T
): Promise<FirebaseUtilsResult<{ id: string }>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, collectionName), docData);

    return {
      success: true,
      data: { id: docRef.id }
    };
  } catch (error) {
    console.error('Error adding document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'ADD_DOCUMENT_ERROR'
    };
  }
}

export async function updateDocument<T = any>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<FirebaseUtilsResult<{ id: string }>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updateData);

    return {
      success: true,
      data: { id: documentId }
    };
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'UPDATE_DOCUMENT_ERROR'
    };
  }
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<FirebaseUtilsResult<{ id: string }>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);

    return {
      success: true,
      data: { id: documentId }
    };
  } catch (error) {
    console.error('Error deleting document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'DELETE_DOCUMENT_ERROR'
    };
  }
}

// Collection operations
export type QueryFilter = {
  field: string;
  operator: '==' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: any;
};

export type QueryOrder = {
  field: string;
  direction: 'asc' | 'desc';
};

export type CollectionQueryOptions = {
  filters?: QueryFilter[];
  orderBy?: QueryOrder[];
  limit?: number;
};

export async function getCollection<T = any>(
  collectionName: string,
  options: CollectionQueryOptions = {}
): Promise<FirebaseUtilsResult<T[]>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    let q = collection(db, collectionName);
    const constraints: any[] = [];

    // Apply filters
    if (options.filters) {
      for (const filter of options.filters) {
        constraints.push(where(filter.field, filter.operator, filter.value));
      }
    }

    // Apply ordering
    if (options.orderBy) {
      for (const order of options.orderBy) {
        constraints.push(orderBy(order.field, order.direction));
      }
    }

    // Apply limit
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q;
    const snapshot = await getDocs(finalQuery);

    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    return {
      success: true,
      data: documents
    };
  } catch (error) {
    console.error('Error getting collection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'GET_COLLECTION_ERROR'
    };
  }
}

export async function getCollectionCount(
  collectionName: string,
  options: CollectionQueryOptions = {}
): Promise<FirebaseUtilsResult<number>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    let q = collection(db, collectionName);
    const constraints: any[] = [];

    // Apply filters
    if (options.filters) {
      for (const filter of options.filters) {
        constraints.push(where(filter.field, filter.operator, filter.value));
      }
    }

    const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q;
    const snapshot = await getDocs(finalQuery);

    return {
      success: true,
      data: snapshot.size
    };
  } catch (error) {
    console.error('Error getting collection count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'GET_COUNT_ERROR'
    };
  }
}

// Batch operations
export async function batchWrite(operations: Array<{
  type: 'add' | 'update' | 'delete';
  collection: string;
  documentId?: string;
  data?: any;
}>): Promise<FirebaseUtilsResult<{ operationsCount: number }>> {
  try {
    if (!db) {
      return { success: false, error: 'Database not initialized', code: 'DB_NOT_INITIALIZED' };
    }

    const batch = writeBatch(db);

    for (const operation of operations) {
      switch (operation.type) {
        case 'add':
          if (!operation.data) throw new Error('Data required for add operation');
          const addRef = operation.documentId 
            ? doc(db, operation.collection, operation.documentId)
            : doc(collection(db, operation.collection));
          batch.set(addRef, {
            ...operation.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          break;

        case 'update':
          if (!operation.documentId || !operation.data) throw new Error('DocumentId and data required for update operation');
          const updateRef = doc(db, operation.collection, operation.documentId);
          batch.update(updateRef, {
            ...operation.data,
            updatedAt: serverTimestamp()
          });
          break;

        case 'delete':
          if (!operation.documentId) throw new Error('DocumentId required for delete operation');
          const deleteRef = doc(db, operation.collection, operation.documentId);
          batch.delete(deleteRef);
          break;
      }
    }

    await batch.commit();

    return {
      success: true,
      data: { operationsCount: operations.length }
    };
  } catch (error) {
    console.error('Error in batch write:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'BATCH_WRITE_ERROR'
    };
  }
}

// Helper function to check if result is an error
export function isFirebaseError<T>(result: FirebaseUtilsResult<T>): result is FirebaseUtilsError {
  return !result.success;
}

// Helper function to handle Firebase results in API routes
export function handleFirebaseResult<T>(
  result: FirebaseUtilsResult<T>,
  successStatus: number = 200,
  errorStatus: number = 500
) {
  if (isFirebaseError(result)) {
    const status = result.code === 'DB_NOT_INITIALIZED' ? 503 : errorStatus;
    return Response.json(result, { status });
  }

  return Response.json(result, { status: successStatus });
}