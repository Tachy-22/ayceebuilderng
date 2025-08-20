import ProductsPage from "@/layouts/Products";
import React from "react";
import { Metadata } from "next";
import { Product, ProductNew } from "@/data/products";
import ProductsProvider from "./productsProvider";

export const metadata: Metadata = {
  title: "Construction Products",
  description:
    "Browse our extensive range of construction materials, tools, and supplies for your building projects.",
  keywords: [
    "construction products",
    "building materials",
    "construction tools",
    "nigeria construction supplies",
  ],
  openGraph: {
    title: "Construction Products | Ayceebuilder Nigeria",
    description:
      "Browse our extensive range of construction materials, tools, and supplies for your building projects.",
  },
};

// Define the props type for the page component
interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortDirection?: string;
    inStock?: string;
    sheet?:string
  };
}

// Define the Firebase API response type
interface FirebaseProductResponse {
  success: boolean;
  data: ProductNew[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    category?: string;
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDirection?: string;
    inStock?: boolean;
  };
}

const page = async ({ searchParams }: PageProps) => {
  // Get parameters from the URL or use defaults
  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "12", 10);
  // Support both new 'category' parameter and legacy 'sheet' parameter for backward compatibility
  const category = searchParams.category || searchParams.sheet || "all";
  const search = searchParams.search || "";
  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";
  const sortBy = searchParams.sortBy || "createdAt";
  const sortDirection = searchParams.sortDirection || "desc";
  const inStock = searchParams.inStock || "";

  // Build API URL - use search endpoint if we have search term or filters
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const useSearchEndpoint = search || minPrice || maxPrice || inStock;
  const apiPath = useSearchEndpoint ? '/api/products/search' : '/api/products';
  
  // Build query string for the API request
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: limit.toString(),
    category,
    sortBy,
    sortDirection
  });

  // Add optional parameters
  if (search) queryParams.append('search', search);
  if (minPrice) queryParams.append('minPrice', minPrice);
  if (maxPrice) queryParams.append('maxPrice', maxPrice);
  if (inStock) queryParams.append('inStock', inStock);

  const url = `${baseUrl}${apiPath}?${queryParams.toString()}`;
  console.log('Fetching products from Firebase:', url);

  try {
    const res = await fetch(url, { 
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response: FirebaseProductResponse = await res.json();

    if (!response.success) {
      console.error('API returned error:', response);
      // Fallback to empty state
      return (
        <ProductsProvider products={[]}>
          <ProductsPage
            currentPage={currentPage}
            limit={limit}
            category={category}
            search={search}
            hasMore={false}
            totalItems={0}
            totalPages={1}
          />
        </ProductsProvider>
      );
    }

    console.log(`Loaded ${response.data.length} products from Firebase`);

    return (
      <ProductsProvider products={response.data || []}>
        <ProductsPage
          currentPage={response.pagination.currentPage}
          limit={response.pagination.itemsPerPage}
          category={category}
          search={search}
          hasMore={response.pagination.hasNextPage}
          totalItems={response.pagination.totalItems}
          totalPages={response.pagination.totalPages}
        />
      </ProductsProvider>
    );

  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    
    // Fallback to empty state on error
    return (
      <ProductsProvider products={[]}>
        <ProductsPage
          currentPage={currentPage}
          limit={limit}
          category={category}
          search={search}
          hasMore={false}
          totalItems={0}
          totalPages={1}
        />
      </ProductsProvider>
    );
  }
};

export default page;
