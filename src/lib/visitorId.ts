/**
 * Utility functions for handling anonymous visitor identification
 */
import { generateUserIdentifier, getUserIP } from "./userIdentification";

// Generate a random ID
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Get or create a visitor ID that persists in localStorage
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return generateId(); // For SSR, generate a temporary ID
  }

  let visitorId = localStorage.getItem("visitor_id");

  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem("visitor_id", visitorId);

    // Also check if we already have an IP-based ID
    const existingIpBasedId = localStorage.getItem("ip_based_id");
    if (existingIpBasedId) {
      // If we already have an IP-based ID, use it as the visitorId for consistency
      visitorId = existingIpBasedId;
      localStorage.setItem("visitor_id", existingIpBasedId);
    } else {
      // If no IP-based ID exists, use the visitorId as the IP-based ID
      localStorage.setItem("ip_based_id", visitorId);
    }

    // Also generate and store IP-based ID for consistency across identification methods
    getUserIP()
      .then((ip) => {
        const ipBasedId = generateUserIdentifier(ip);
        localStorage.setItem("ip_based_id", ipBasedId);

        // For consistency, update the visitor_id as well
        localStorage.setItem("visitor_id", ipBasedId);
      })
      .catch((err) => {
        console.error("Failed to get IP-based ID:", err);
      });
  }

  // Log the IDs for debugging
  console.log("Current visitorId:", visitorId);
  console.log("Current ip_based_id:", localStorage.getItem("ip_based_id"));

  return visitorId;
}

// Save user's comment information for future comments
export function saveCommenterInfo(name: string, email: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("commenter_name", name);
  localStorage.setItem("commenter_email", email);
}

// Get saved commenter information
export function getCommenterInfo(): { name: string; email: string } {
  if (typeof window === "undefined") {
    return { name: "", email: "" };
  }

  return {
    name: localStorage.getItem("commenter_name") || "",
    email: localStorage.getItem("commenter_email") || "",
  };
}
