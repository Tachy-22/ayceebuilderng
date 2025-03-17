"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WishlistProvider } from "@/contexts/WishlistContext";
import React, { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CartProvider> {children}</CartProvider>
        </TooltipProvider>
      </WishlistProvider>
    </div>
  );
};

export default Providers;
