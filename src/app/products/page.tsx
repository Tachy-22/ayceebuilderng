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
    sheet?: string;
    search?: string;
  };
}

// Define the API response type
interface ProductResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: ProductNew[];
}

const page = async ({ searchParams }: PageProps) => {
  // Get parameters from the URL or use defaults
  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "12", 10);
  const sheet = searchParams.sheet || "all";
  const search = searchParams.search || "";

  // API URL for fetching products
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbzAP8eEfRBVKyCDUhp2LlFHcvMZrbvC6IY_XI5rx7wfHKVkSTmbirWU-6eVy5_nhvWr/exec";

  // Build query string for the API request
  let queryParams = `?page=${currentPage}&limit=${limit}&sheet=${sheet}`;

  // Add search parameter if it exists
  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  const url = `${apiUrl}${queryParams}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const response: ProductResponse = await res.json();

  // console.log(response);

  return (
    <ProductsProvider products={response.data || []}>
      <ProductsPage
        //  fetchedProducts={response.data || []}
        apiUrl={apiUrl}
        currentPage={currentPage}
        limit={limit}
        sheet={sheet}
        search={search}
        hasMore={currentPage < response.totalPages}
        totalItems={response.total}
        totalPages={response.totalPages}
      />
    </ProductsProvider>
  );
};

export default page;
