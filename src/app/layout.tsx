import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import Providers from "./providers";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Script from "next/script";
import LayoutWrapper from "@/components/LayoutWrapper";

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
        url: "/og-image.png",
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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZSKZ57GTQP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZSKZ57GTQP');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <Providers>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </Providers>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
