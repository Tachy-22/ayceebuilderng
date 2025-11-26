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

// Vendor interface matching the layout component
interface Vendor {
  id: string;
  name: string;
  businessName: string;
  photo?: string;
  profileImage?: string;
  businessType: string;
  location: string;
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  description: string;
  verified: boolean;
  featured: boolean;
  whatsAppNumber?: string;
  email: string;
  phone: string;
  services: string[];
  specializations: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

const VendorsPage = async () => {
  // Fetch vendors data from our Firebase API
  let vendorsData: Vendor[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/vendors`, {
      next: { revalidate: 0 }, // Revalidate once per hour
      cache: "no-store",

    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vendors: ${res.status}`);
    }
    const response = await res.json();

    console.log({ vendorsData })
    vendorsData = response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching vendors data:", error);
    // Component will show empty state
  }

  return (
    <div>
      <Vendors fetchedVendors={vendorsData || []} />
    </div>
  );
};

export default VendorsPage;

export const revalidate = 0;
export const dynamic = "force-dynamic";
