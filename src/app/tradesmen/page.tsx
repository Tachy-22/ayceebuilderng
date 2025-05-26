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

// Define the API response type for Tradesmen
interface TradesmanData {
  id: string;
  name: string;
  photo: string;
  trade: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  description: string;
  verified: boolean;
  completedProjects: number;
  whatsappNumber?: string; // Optional WhatsApp number for direct contact
}

interface TradesmenResponse {
  data: TradesmanData[];
}

const TradesmenPage = async () => {
  // API URL for fetching tradesmen
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbyGAOxbMYE975ofGeJcJderdFq8MnIrgsRUU84S6jnSH76evqmMNhTeTLUe8RTBwsqF/exec?sheet=tradesmen";
  // Fetch tradesmen data
  let tradesmenData: TradesmanData[] = [];

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 0 } }); // Revalidate once per hour

    if (!res.ok) {
      throw new Error(`Failed to fetch tradesmen: ${res.status}`);
    }

    const response: TradesmenResponse = await res.json();
    tradesmenData = response.data || [];
  } catch (error) {
    console.error("Error fetching tradesmen data:", error);
    // Fallback data will be used from the component
  }

  console.log({ res: tradesmenData });

  return (
    <div>
      <Tradesmen fetchedTradesmen={tradesmenData || []} />
    </div>
  );
};

export default TradesmenPage;
