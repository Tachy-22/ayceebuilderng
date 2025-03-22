import ProductsPage from "@/layouts/Products";
import React from "react";
import { Metadata } from "next";
import { ProductNew } from "@/data/products";

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
    sheet?: string;
    search?: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  // Get parameters from the URL or use defaults
  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "12", 10);
  const sheet = searchParams.sheet || "all";
  const search = searchParams.search || "";

  // API URL for fetching products
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbztbKRga_98oBmFrtzddOaYWWXKeCWyfNVCldKxjO7zWorKnv24lVJJ73hUiVVXGz3N/exec";

  // Build query string for the API request
  let queryParams = `?page=${currentPage}&limit=${limit}&sheet=${sheet}`;

  // Add search parameter if it exists
  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  const url = `${apiUrl}${queryParams}`;
  const res = await fetch(url, { cache: "no-store" }); // Ensure fresh data
  const response = await res.json();

  // Extract products from the response
  const products = Array.isArray(response.data) ? response.data : [];

  // Determine if there are more products to load
  const hasMore = products.length >= limit;

  return (
    <div>
      <ProductsPage
        fetchedProducts={products}
        apiUrl={apiUrl}
        currentPage={currentPage}
        limit={limit}
        sheet={sheet}
        search={search}
        hasMore={hasMore}
      />
    </div>
  );
};

export default page;
