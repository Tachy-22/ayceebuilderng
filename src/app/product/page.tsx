import ProductDetail from "@/layouts/ProductDetail";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details",
  description: "Detailed information about construction materials including specifications, vendor information, reviews, and more.",
  openGraph: {
    title: "Product Details | Ayceebuilder Nigeria",
    description: "Detailed information about construction materials including specifications, vendor information, reviews, and more.",
  }
};

const page = () => {
  return (
    <div>
      <ProductDetail />
    </div>
  );
};

export default page;
