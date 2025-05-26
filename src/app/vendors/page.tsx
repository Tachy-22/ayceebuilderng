import Vendors from "@/layouts/Vendors";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building Material Vendors",
  description:
    "Browse trusted vendors of construction materials in Nigeria. Find quality suppliers for your building projects.",
  keywords: [
    "construction vendors",
    "building materials suppliers",
    "nigeria contractors",
    "construction materials",
    "building supplies",
  ],
  openGraph: {
    title: "Building Material Vendors | Ayceebuilder Nigeria",
    description:
      "Browse trusted vendors of construction materials in Nigeria. Find quality suppliers for your building projects.",
  },
};

// Define the API response type for Vendors
interface VendorData {
  id: string;
  name: string;
  photo: string;
  category: string;
  location: string;
  rating?: number;
  reviews: number;
  established: string;
  description: string;
  verified: boolean;
  completedTransactions: number;
  whatsAppNumber?: string;
  products?: string[];
}

interface VendorsResponse {
  data: VendorData[];
}

const VendorsPage = async () => {
  // API URL for fetching vendors - use our local API endpoint
  const apiUrl =
  "https://script.google.com/macros/s/AKfycbyGAOxbMYE975ofGeJcJderdFq8MnIrgsRUU84S6jnSH76evqmMNhTeTLUe8RTBwsqF/exec?sheet=vendors";

  // Fetch vendors data
  let vendorsData: VendorData[] = [];
  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Revalidate once per hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vendors: ${res.status}`);
    }
    const response: VendorsResponse = await res.json();
    vendorsData = response.data || [];

    // Process products from string to array if needed
    vendorsData = vendorsData.map((vendor) => {
      if (typeof vendor.products === "string") {
        return {
          ...vendor,
          products: (vendor.products as string)
            .split(",")
            .map((item) => item.trim()),
        };
      }
      return vendor;
    });
  } catch (error) {
    console.error("Error fetching vendors data:", error);
    // Fallback data will be used from the component
  }

  return (
    <div>
      <Vendors fetchedVendors={vendorsData || []} />
    </div>
  );
};

export default VendorsPage;
