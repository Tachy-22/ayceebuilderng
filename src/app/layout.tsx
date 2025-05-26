import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import Providers from "./providers";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ayceebuilder Nigeria | Building Materials eCommerce",
    template: "%s | Ayceebuilder Nigeria",
  },
  description:
    "Modern eCommerce platform for building materials in Nigeria. Find quality products for contractors, builders, and homeowners.",
  keywords: [
    "construction",
    "building materials",
    "ecommerce",
    "Nigeria",
    "contractors",
    "builders",
    "construction supplies",
  ],
  authors: [{ name: "Ayceebuilder Nigeria" }],
  creator: "Ayceebuilder Nigeria",
  publisher: "Ayceebuilder Nigeria",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://ayceebuilder.com"),
  openGraph: {
    title: "Ayceebuilder Nigeria | Building Materials eCommerce",
    description: "Modern eCommerce platform for building materials in Nigeria.",
    url: "https://ayceebuilder.com",
    images: [
      {
        url: "/og-image.png", // Update this path to your actual image
        width: 1200,
        height: 630,
        alt: "ayceebuilder",
      },
    ],
    siteName: "Ayceebuilder Nigeria",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayceebuilder Nigeria",
    description: "Modern eCommerce platform for building materials in Nigeria.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="overflow-x-hidden">
            {" "}
            <Navbar />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
