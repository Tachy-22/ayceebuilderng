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
  const limit = parseInt(searchParams.limit || "8", 10); // Showing fewer products per category

  // API URL for fetching products
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbyUI4V2K5upEtuvk4lYLqgl7_2JNAECT8mUTDPGY8k_Gajia1v1YDjHfeKwBmzMo6T3/exec";

  // Fetch products for selected category if any
  let products: ProductNew[] = [];
  let hasMore = false;
  
  if (categoryId) {
    // Build query string
    const queryParams = `?page=${currentPage}&limit=${limit}&sheet=${categoryId}`;
    const url = `${apiUrl}${queryParams}`;
    
    // Fetch data
    const res = await fetch(url, { cache: "no-store" }); // Ensure fresh data
    const response = await res.json();
    
    // Extract products from the response
    products = Array.isArray(response.data) ? response.data : [];
    
    // Determine if there are more products to load
    hasMore = products.length >= limit;
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
