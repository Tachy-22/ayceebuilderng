"use server";

import { getCloudinaryPublicId } from "@/lib/cloudinary";

/**
 * Deletes an image from Cloudinary using their Admin API
 * @param imageUrl The full Cloudinary image URL to delete
 * @returns Result of the deletion operation
 */
export async function deleteCloudinaryImage(imageUrl: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Missing Cloudinary credentials in environment variables"
      );
    }

    // Extract the public ID from the Cloudinary URL
    const publicId = getCloudinaryPublicId(imageUrl);
    if (!publicId) {
      throw new Error("Could not extract public ID from Cloudinary URL");
    }

    // Build the API URL for deletion
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(
      `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    );

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    // Call Cloudinary's destroy API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.result === "ok") {
      return { success: true, message: "Image deleted successfully" };
    } else {
      throw new Error(result.error?.message || "Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generate a SHA-1 signature for Cloudinary API authentication
 */
async function generateSignature(string: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
