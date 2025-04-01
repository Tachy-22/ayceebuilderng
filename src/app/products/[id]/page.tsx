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
    sheet?: string;
  };
}

const page = async ({ params, searchParams }: PageProps) => {
  const { id } = params;
  const { searchTitle, sheet } = searchParams;

  // Base API URL
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbyEk6BGwOcRfk8-W_CTzLucKsj13Rx3eoyITKz9_ghDbP0lnSdoGmeqoa7MMaXsmm7W/exec";

  let productData: ProductNew | null = null;

  // If we have a search title, use it to find the product
  if (searchTitle) {
    // Build the URL with search parameter
    const searchUrl = `${apiUrl}?sheet${encodeURIComponent(
      sheet || "all"
    )}&search=${encodeURIComponent(searchTitle)}&limit=1`;

    try {
      // Fetch product by title
      const response = await fetch(searchUrl, { next: { revalidate: 3600 } });
      const result = await response.json();

      // If we found a product, use it
      if (result && Array.isArray(result.data) && result.data.length > 0) {
        productData = result.data[0];
      }
    } catch (error) {
      console.error("Error fetching product by title:", error);
    }
  }

  // If we didn't find by title or no title was provided, try to fetch by ID

  return <ProductDetail rawProduct={productData || undefined} />;
};

export default page;
