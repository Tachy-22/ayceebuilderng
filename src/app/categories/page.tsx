import Categories from "@/layouts/Categories";
import { ProductNew } from "@/data/products";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Categories",
  description: "Browse our wide range of construction material categories",
  keywords: ["construction categories", "building materials", "construction supplies"],
};

// Define the props type for the page component
interface PageProps {
  searchParams: {
    category?: string;
    page?: string;
    limit?: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  // Get parameters from URL or use defaults
  const categoryId = searchParams.category || null;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "8", 10);

  // Use Firebase API for fetching products
  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products`;

  // Fetch products for selected category if any
  let products: ProductNew[] = [];
  let hasMore = false;
  
  if (categoryId) {
    try {
      // Build query string for Firebase API
      const queryParams = `?page=${currentPage}&limit=${limit}&category=${categoryId}`;
      const url = `${apiUrl}${queryParams}`;
      
      // Fetch data from Firebase
      const res = await fetch(url, { cache: "no-store" });
      const response = await res.json();
      
      // Extract products from the response
      products = response.success ? response.data : [];
      hasMore = products.length >= limit;
    } catch (error) {
      console.error('Error fetching products:', error);
      products = [];
      hasMore = false;
    }
  }

  return (
    <div>
      <Categories 
        apiUrl={apiUrl}
        fetchedProducts={products}
        selectedCategory={categoryId}
        currentPage={currentPage}
        limit={limit}
        hasMore={hasMore}
      />
    </div>
  );
};

export default page;
