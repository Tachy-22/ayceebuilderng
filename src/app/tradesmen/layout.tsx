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

export default function TradesmenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}