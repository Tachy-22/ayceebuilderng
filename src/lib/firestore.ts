import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderItem, OrderStatus } from '@/types/order';
import { UserProfile } from '@/types/user';
import { toJSDate } from './formatOrderDate';

// Helper function to remove undefined values from objects
const cleanObjectForFirestore = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Preserve Firestore Timestamp objects as-is
  if (obj instanceof Timestamp) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanObjectForFirestore);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanObjectForFirestore(value);
      }
    }
    return cleaned;
  }
  
  return obj;
};

// Order Management Functions
export const createOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'updatedAt'>) => {
  try {
    //console.log('🚀 Starting order creation process...');
    //console.log('📦 Order data received:', JSON.stringify(orderData, null, 2));
    
    // Check if db is initialized
    if (!db) {
      console.error('❌ Firestore database not initialized');
      throw new Error('Firestore database not initialized');
    }
    
    //console.log('✅ Firestore database is initialized');
    
    const orderNumber = generateOrderNumber();
    //console.log('🔢 Generated order number:', orderNumber);
    
    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderNumber,
      orderDate: new Date(),
      updatedAt: new Date(),
    };

    //console.log('📝 Prepared order object:', JSON.stringify(order, null, 2));

    // Clean the order data to remove undefined values
    const orderForFirestore = {
      ...order,
      orderDate: Timestamp.fromDate(order.orderDate),
      updatedAt: Timestamp.fromDate(order.updatedAt),
      estimatedDeliveryDate: Timestamp.fromDate(order.estimatedDeliveryDate),
    };

    const cleanedOrder = cleanObjectForFirestore(orderForFirestore);
    //console.log('🧹 Cleaned order object:', JSON.stringify(cleanedOrder, null, 2));

    const docRef = await addDoc(collection(db, 'orders'), cleanedOrder);

    //console.log('✅ Order successfully created with ID:', docRef.id);
    const result = { id: docRef.id, ...order };
    //console.log('🎉 Returning order result:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
};

export const getUserOrders = async (userId: string, limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('orderDate', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        orderDate: data.orderDate.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        orderDate: data.orderDate.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Order;
    }

    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrdersByStatus = async (userId: string, status: OrderStatus) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('orderDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        orderDate: data.orderDate.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

// User Profile Management
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData = {
      ...profileData,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Utility Functions
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ACB-${timestamp}-${randomStr}`.toUpperCase();
};

// Batch Operations (for performance)
export const createMultipleOrders = async (orders: Omit<Order, 'id' | 'orderDate' | 'updatedAt'>[]) => {
  try {
    const batch = writeBatch(db);
    const orderRefs: { id: string; order: Order }[] = [];

    orders.forEach((orderData) => {
      const orderRef = doc(collection(db, 'orders'));
      const order: Order = {
        id: orderRef.id,
        ...orderData,
        orderNumber: generateOrderNumber(),
        orderDate: new Date(),
        updatedAt: new Date(),
      };

      batch.set(orderRef, {
        ...order,
        orderDate: Timestamp.fromDate(toJSDate(order.orderDate)),
        updatedAt: Timestamp.fromDate(order.updatedAt),
      });

      orderRefs.push({ id: orderRef.id, order });
    });

    await batch.commit();
    return orderRefs;
  } catch (error) {
    console.error('Error creating multiple orders:', error);
    throw error;
  }
};

// Search and Filter Functions
export const searchUserOrders = async (userId: string, searchTerm: string) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that searches by order number
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('orderDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const order = {
        id: doc.id,
        ...data,
        orderDate: data.orderDate.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Order;

      // Client-side filtering by order number or item names
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (matchesSearch) {
        orders.push(order);
      }
    });

    return orders;
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
};

// Statistics Functions for Homepage
export const getProductsCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching products count:', error);
    return 0;
  }
};

export const getVendorsCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching vendors count:', error);
    return 0;
  }
};

export const getUsersCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching users count:', error);
    return 0;
  }
};

export const getHomePageStats = async () => {
  try {
    const [productsCount, vendorsCount, usersCount] = await Promise.all([
      getProductsCount(),
      getVendorsCount(),
      getUsersCount()
    ]);

    return {
      products: productsCount,
      vendors: vendorsCount,
      customers: usersCount
    };
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return {
      products: 0,
      vendors: 0,
      customers: 0
    };
  }
};