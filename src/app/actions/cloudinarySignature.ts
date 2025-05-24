"use server";

/**
 * Server action for generating Cloudinary upload signature
 */
export async function getCloudinaryUploadSignature() {
  try {
    // Validate environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing Cloudinary credentials");
    }

    // Create timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create the string to sign
    // For a basic upload with a public_id and folder
    const params = {
      timestamp: timestamp.toString(),
      folder: "blog_images", // Store all blog images in this folder
    };

    // Convert params to a string for signing
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key as keyof typeof params]}`)
      .join("&");

    // Create the signature string with the API secret
    const toSign = paramString + apiSecret;

    // Generate a SHA-1 hash of the signature string
    const signature = await generateSHA1(toSign);

    return {
      success: true,
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder: "blog_images",
    };
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate a SHA-1 hash using the Web Crypto API
 */
async function generateSHA1(message: string): Promise<string> {
  // Convert the message to a buffer
  const msgBuffer = new TextEncoder().encode(message);

  // Create a SHA-1 hash
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
