"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  color?: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getItemCount: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  // Add product to cart
  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      // Check if product has a selected color
      const productColor = product.selectedColor || null;

      // Create a unique ID for the cart item - include color in the ID if present
      const cartItemId = productColor
        ? `${product.id}-${productColor}`
        : product.id;

      // Check if the product with the same color is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === cartItemId
      );

      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;

        toast({
          title: "Cart updated",
          description: `${product.name} ${
            productColor ? `(${productColor})` : ""
          } quantity updated in your cart`,
        });

        return updatedItems;
      } else {
        // Otherwise, add a new item
        toast({
          title: "Added to cart",
          description: `${product.name} ${
            productColor ? `(${productColor})` : ""
          } has been added to your cart`,
        });

        return [
          ...prevItems,
          {
            id: cartItemId,
            product,
            quantity,
            color: productColor || undefined,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === id);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.product.name} has been removed from your cart`,
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
