"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WishlistProvider } from "@/contexts/WishlistContext";
import React, { ReactNode, useRef } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/redux/store";

const Providers = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <div>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Provider store={storeRef.current}>
            <CartProvider> {children}</CartProvider>
          </Provider>
        </TooltipProvider>
      </WishlistProvider>
    </div>
  );
};

export default Providers;
