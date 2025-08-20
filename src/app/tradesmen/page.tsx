import Tradesmen from "@/layouts/Tradesmen";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Tradesmen",
  description:
    "Find skilled construction professionals in Nigeria. Connect with carpenters, electricians, plumbers, painters, and more for your building projects.",
  keywords: [
    "construction tradesmen",
    "skilled workers",
    "nigeria contractors",
    "carpenters",
    "electricians",
    "plumbers",
  ],
  openGraph: {
    title: "Construction Tradesmen | Ayceebuilder Nigeria",
    description:
      "Find skilled construction professionals in Nigeria. Connect with carpenters, electricians, plumbers, painters, and more for your building projects.",
  },
};

// Tradesman interface matching the layout component
interface Tradesman {
  id: string;
  name: string;
  email: string;
  phone: string;
  trade: string;
  description: string;
  location: string;
  profileImage?: string;
  workImages?: string[];
  licenseDocuments: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  skills: string[];
  yearsOfExperience: number;
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate?: number;
  projectRate?: number;
  preferredPayment: string[];
  emergencyAvailable: boolean;
  travelDistance: number;
  languages: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

const TradesmenPage = async () => {
  // Fetch tradesmen data from our Firebase API
  let tradesmenData: Tradesman[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tradesmen`, {
      next: { revalidate: 0 }, // Revalidate once per hour
    });
    console.log({ res })
    if (!res.ok) {
      throw new Error(`Failed to fetch tradesmen: ${res.status}`);
    }

    const response = await res.json();
    tradesmenData = response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching tradesmen data:", error);
    // Component will show empty state
  }

  console.log({ tradesmenData })
  return (
    <div>
      <Tradesmen fetchedTradesmen={tradesmenData || []} />
    </div>
  );
};

export default TradesmenPage;
