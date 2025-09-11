import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  writeBatch,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductVariant } from '@/data/products';
import { 
  getCollection, 
  addDocument, 
  updateDocument, 
  deleteDocument,
  isFirebaseError 
} from './firebase-utils';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  color?: string;
  variant?: ProductVariant;
  addedAt: Date;
  updatedAt: Date;
  // Product details stored for faster access
  product: Product
}

// Add item to cart
export const addToCart = async (userId: string, productData: any, quantity: number = 1, color?: string, variant?: ProductVariant) => {
  try {
    console.log('🛒 Adding to cart:', {
      userId,
      productId: productData?.id,
      productName: productData?.name,
      quantity,
      color,
      variant: variant?.variant_name
    });

    if (!db) {
      throw new Error('Database not initialized');
    }

    // Check if item already exists in cart (need to fetch all and filter client-side due to complex variant matching)
    const cartRef = collection(db, 'carts');
    const existingItemQuery = query(
      cartRef,
      where('userId', '==', userId),
      where('productId', '==', productData.id)
    );
    
    const existingItems = await getDocs(existingItemQuery);
    console.log('🔍 Found', existingItems.size, 'existing items for this product');
    
    // Find exact match (considering color and variant)
    let matchingItem = null;
    if (!existingItems.empty) {
      matchingItem = existingItems.docs.find(doc => {
        const data = doc.data();
        const colorMatch = (data.color || null) === (color || null);
        const variantMatch = variant 
          ? (data.variant?.id === variant.id)
          : !data.variant;
        return colorMatch && variantMatch;
      });
    }
    
    if (matchingItem) {
      console.log('📈 Updating existing cart item quantity');
      // Update existing item quantity
      await updateDoc(matchingItem.ref, {
        quantity: increment(quantity),
        updatedAt: Timestamp.fromDate(new Date())
      });
      const result = { id: matchingItem.id, ...matchingItem.data() };
      console.log('✅ Updated cart item:', result.id);
      return result;
    } else {
      console.log('➕ Adding new cart item');
      // Add new item to cart
      const cartItem: any = {
        userId,
        productId: productData.id,
        quantity,
        addedAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          discountPrice: productData.discountPrice,
          image: productData.image,
          category: productData.category,
          inStock: productData.inStock,
          weight: productData.weight,
          vendor: productData.vendor
        }
      };

      // Only add color field if it has a value
      if (color) {
        cartItem.color = color;
      }

      // Only add variant field if it has a value
      if (variant) {
        cartItem.variant = variant;
      }

      const docRef = await addDoc(cartRef, {
        ...cartItem,
        addedAt: Timestamp.fromDate(cartItem.addedAt),
        updatedAt: Timestamp.fromDate(cartItem.updatedAt)
      });

      const result = { id: docRef.id, ...cartItem };
      console.log('✅ Added new cart item:', result.id);
      return result;
    }
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId: string) => {
  try {
    const result = await deleteDocument('carts', cartItemId);
    if (isFirebaseError(result)) {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Update item quantity
export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  try {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    
    await updateDoc(doc(db, 'carts', cartItemId), {
      quantity,
      updatedAt: Timestamp.fromDate(new Date())
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Get user's cart items
export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const result = await getCollection<CartItem>('carts', {
      filters: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'addedAt', direction: 'desc' }]
    });

    if (isFirebaseError(result)) {
      throw new Error(result.error);
    }

    return result.data.map(item => ({
      ...item,
      addedAt: item.addedAt instanceof Date ? item.addedAt : new Date(item.addedAt),
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching user cart:', error);
    throw error;
  }
};

// Clear entire cart
export const clearUserCart = async (userId: string) => {
  try {
    const cartRef = collection(db, 'carts');
    const cartQuery = query(cartRef, where('userId', '==', userId));
    const cartSnapshot = await getDocs(cartQuery);
    
    const batch = writeBatch(db);
    cartSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Subscribe to cart changes (real-time updates)
export const subscribeToUserCart = (userId: string, callback: (cartItems: CartItem[]) => void) => {
  const cartRef = collection(db, 'carts');
  const cartQuery = query(cartRef, where('userId', '==', userId));
  
  return onSnapshot(cartQuery, (snapshot) => {
    const cartItems: CartItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      cartItems.push({
        id: doc.id,
        ...data,
        addedAt: data.addedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as CartItem);
    });
    
    callback(cartItems.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()));
  });
};

// Get cart item count
export const getCartItemCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Get cart total
export const getCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => {
    // Use variant price if available, otherwise use product price
    let price = item.product.discountPrice || item.product.price;
    if (item.variant && typeof item.variant.variant_price === 'number') {
      price = item.variant.variant_price;
    }
    return total + (price * item.quantity);
  }, 0);
};

// Merge guest cart with user cart (for when user logs in)
export const mergeGuestCartWithUserCart = async (userId: string, guestCartItems: any[]) => {
  try {
    console.log('🔄 Starting merge for user:', userId, 'with', guestCartItems.length, 'guest items');
    
    for (let index = 0; index < guestCartItems.length; index++) {
      const guestItem = guestCartItems[index];
      console.log(`📦 Merging item ${index + 1}/${guestCartItems.length}:`, {
        productId: guestItem.product?.id,
        productName: guestItem.product?.name,
        quantity: guestItem.quantity,
        color: guestItem.color,
        variant: guestItem.variant?.variant_name
      });
      
      const result = await addToCart(
        userId, 
        guestItem.product, 
        guestItem.quantity, 
        guestItem.color,
        guestItem.variant
      );
      
      console.log(`✅ Item ${index + 1} merged successfully:`, result?.id);
    }
    
    console.log('🎉 All guest items merged successfully');
  } catch (error) {
    console.error('❌ Error merging guest cart:', error);
    throw error;
  }
};