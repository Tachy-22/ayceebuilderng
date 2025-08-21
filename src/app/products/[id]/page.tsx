import ProductDetail from "@/layouts/ProductDetail";
import React from "react";
import { Metadata } from "next";
import { ProductNew } from "@/data/products";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View detailed information about this construction material.",
};

// Define the page props to access searchParams
interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    searchTitle?: string;
    category?: string;
  };
}

// Firebase API response interface
interface FirebaseProductResponse {
  success: boolean;
  data: ProductNew;
  relatedProducts?: ProductNew[];
}

const page = async ({ params, searchParams }: PageProps) => {
  const { id } = params;
  const { searchTitle, category } = searchParams;

  let productData: ProductNew | null = null;

  // Build API URL for Firebase
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    if (searchTitle) {
      // Search for product by title using the search endpoint
      let searchUrl = `${baseUrl}/api/products/search?search=${encodeURIComponent(searchTitle)}&limit=1`;
      
      if (category && category !== 'all') {
        searchUrl += `&category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(searchUrl, { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result: any = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          productData = result.data[0];
        }
      }
    } else if (id) {
      // Fetch product by ID from Firebase
      const response = await fetch(`${baseUrl}/api/products/${id}`, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result: FirebaseProductResponse = await response.json();
        
        if (result.success && result.data) {
          productData = result.data;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching product from Firebase:", error);
  }

  return <ProductDetail rawProduct={(productData as ProductNew) || null} />;
};

export default page;
