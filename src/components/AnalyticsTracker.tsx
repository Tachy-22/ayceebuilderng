"use client";

import { useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePathname } from "next/navigation";

// Generate a simple visitor ID (this is just a basic implementation)
function generateVisitorId() {
  // Check if we already have a visitor ID in localStorage
  const existingId = localStorage.getItem("visitor_id");
  if (existingId) return existingId;
  
  // Generate a new ID and store it
  const newId = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  localStorage.setItem("visitor_id", newId);
  return newId;
}

// Determine referrer type
function getReferrerType(referrer: string) {
  if (!referrer) return "direct";
  
  if (referrer.includes("google") || 
      referrer.includes("bing") ||
      referrer.includes("yahoo")) {
    return "organic";
  }
  
  if (referrer.includes("facebook") ||
      referrer.includes("twitter") ||
      referrer.includes("instagram") ||
      referrer.includes("linkedin") ||
      referrer.includes("pinterest")) {
    return "social";
  }
  
  return "referral";
}

interface AnalyticsTrackerProps {
  blogId?: string;
  pageType: "blog" | "product" | "page";
}

export default function AnalyticsTracker({ blogId, pageType }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Track the page view
    const trackPageView = async () => {
      try {
        const visitorId = generateVisitorId();
        const referrer = document.referrer;
        const referrerType = getReferrerType(referrer);
        
        // Add page view to Firestore
        await addDoc(collection(db, "pageViews"), {
          path: pathname,
          pageType,
          blogId,
          visitorId,
          referrer,
          referrerType,
          userAgent: navigator.userAgent,
          timestamp: serverTimestamp(),
        });
        
        // Track referrer separately
        if (referrer) {
          await addDoc(collection(db, "referrers"), {
            referrer,
            referrerType,
            path: pathname,
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    // Small delay to ensure the page has loaded
    const timer = setTimeout(() => {
      trackPageView();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [pathname, blogId, pageType]);
  
  // This component doesn't render anything
  return null;
}
