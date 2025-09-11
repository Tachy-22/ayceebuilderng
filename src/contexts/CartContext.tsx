"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Product, ProductVariant } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import {
  addToCart as addToFirebaseCart,
  removeFromCart as removeFromFirebaseCart,
  updateCartItemQuantity,
  clearUserCart,
  subscribeToUserCart,
  mergeGuestCartWithUserCart,
  CartItem as FirebaseCartItem
} from "@/lib/cart";

type LocalCartItem = {
  id: string;
  product: Product;
  quantity: number;
  color?: string;
  variant?: ProductVariant;
};

interface CartContextType {
  cartItems: LocalCartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => { },
  removeFromCart: () => { },
  updateQuantity: () => { },
  clearCart: () => { },
  getCartTotal: () => 0,
  getItemCount: () => 0,
  loading: false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Convert Firebase cart item to local cart item format
  const convertFirebaseToLocal = (firebaseItem: FirebaseCartItem): LocalCartItem => {
    return {
      id: firebaseItem.id,
      product: firebaseItem.product,
      quantity: firebaseItem.quantity,
      color: firebaseItem.color,
      variant: firebaseItem.variant,
    };
  };

  // Load cart from localStorage for guest users or Firebase for authenticated users
  useEffect(() => {
    if (user) {
      // User is authenticated - load from Firebase and subscribe to changes
      setLoading(true);

      const unsubscribe = subscribeToUserCart(user.uid, (firebaseCartItems) => {
        const localCartItems = firebaseCartItems.map(convertFirebaseToLocal);
        setCartItems(localCartItems);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Guest user - load from localStorage
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        try {
          const guestCartItems = JSON.parse(savedCart);
          setCartItems(guestCartItems);
        } catch (error) {
          console.error("Error parsing guest cart from localStorage:", error);
          localStorage.removeItem("guestCart");
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      setLoading(false);
    }
  }, [user]);

  // Handle user login - merge guest cart with user cart
  useEffect(() => {
    const handleUserLogin = async () => {
      if (user) {
        console.log('🔄 User logged in, checking for guest cart to merge...');
        
        // Get guest cart from localStorage immediately
        const guestCartJson = localStorage.getItem("guestCart");
        console.log('📦 Guest cart in localStorage:', guestCartJson);
        
        if (guestCartJson) {
          try {
            const guestCartItems = JSON.parse(guestCartJson);
            console.log('🛒 Parsed guest cart items:', guestCartItems.length, 'items');
            
            if (guestCartItems.length > 0) {
              console.log('✅ Starting cart merge process...');
              setLoading(true);
              
              // Add a small delay to ensure Firebase subscription is ready
              await new Promise(resolve => setTimeout(resolve, 500));
              
              await mergeGuestCartWithUserCart(user.uid, guestCartItems);
              localStorage.removeItem("guestCart");
              
              console.log('✅ Cart merge completed successfully');
              toast({
                title: "Cart merged",
                description: "Your guest cart has been merged with your account.",
              });
            } else {
              console.log('ℹ️ Guest cart is empty, no merge needed');
            }
          } catch (error) {
            console.error("❌ Error merging guest cart:", error);
          } finally {
            setLoading(false);
          }
        } else {
          console.log('ℹ️ No guest cart found in localStorage');
        }
      }
    };

    handleUserLogin();
  }, [user]);

  // Save guest cart to localStorage when user is not authenticated
  useEffect(() => {
    if (!user) {
      if (cartItems.length > 0) {
        localStorage.setItem("guestCart", JSON.stringify(cartItems));
      } else {
        // Clear localStorage if cart is empty
        localStorage.removeItem("guestCart");
      }
    }
  }, [cartItems, user]);
  // Add product to cart
  const addToCart = async (product: Product, quantity: number, variant?: ProductVariant) => {
    const productColor = product.selectedColor || undefined;
    const productVariant = variant || product.selectedVariant || undefined;

    try {
      if (user) {
        // User is authenticated - add to Firebase
        await addToFirebaseCart(user.uid, product, quantity, productColor, productVariant);
        
        const variantText = productVariant ? ` (${productVariant.variant_name})` : "";
        const colorText = productColor ? ` (${productColor})` : "";
        
        toast({
          title: "Added to cart",
          description: `${product.name}${variantText}${colorText} has been added to your cart`,
        });
      } else {
        // Guest user - add to local state
        setCartItems((prevItems) => {
          // Create unique ID based on product, color, and variant
          let cartItemId = product.id;
          if (productColor) cartItemId += `-${productColor}`;
          if (productVariant) cartItemId += `-${productVariant.id}`;

          const existingItemIndex = prevItems.findIndex(
            (item) => item.id === cartItemId
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;

            const variantText = productVariant ? ` (${productVariant.variant_name})` : "";
            const colorText = productColor ? ` (${productColor})` : "";

            toast({
              title: "Cart updated",
              description: `${product.name}${variantText}${colorText} quantity updated in your cart`,
            });

            return updatedItems;
          } else {
            const variantText = productVariant ? ` (${productVariant.variant_name})` : "";
            const colorText = productColor ? ` (${productColor})` : "";
            
            toast({
              title: "Added to cart",
              description: `${product.name}${variantText}${colorText} has been added to your cart`,
            });

            const newCartItem = {
              id: cartItemId,
              product,
              quantity,
              color: productColor,
              variant: productVariant,
            };
            
            console.log('Adding to cart (guest):', newCartItem);
            
            return [
              ...prevItems,
              newCartItem,
            ];
          }
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      });
    }
  };

  const removeFromCart = async (id: string) => {
    const item = cartItems.find((item) => item.id === id);

    try {
      if (user) {
        // User is authenticated - remove from Firebase
        await removeFromFirebaseCart(id);
      } else {
        // Guest user - remove from local state
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }

      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.product.name} has been removed from your cart`,
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      if (user) {
        // User is authenticated - update in Firebase
        await updateCartItemQuantity(id, quantity);
      } else {
        // Guest user - update local state
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart quantity. Please try again.",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // User is authenticated - clear Firebase cart
        await clearUserCart(user.uid);
      } else {
        // Guest user - clear local state and localStorage
        setCartItems([]);
        localStorage.removeItem("guestCart");
      }

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart. Please try again.",
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Use variant price if available, otherwise use product price
      let price = item.product.discountPrice || item.product.price;
      if (item.variant && typeof item.variant.variant_price === 'number') {
        price = item.variant.variant_price;
      }
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
