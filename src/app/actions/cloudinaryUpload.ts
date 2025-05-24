"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generates a signature for Cloudinary upload
 * This allows for more secure uploading without exposing the API secret
 */
export async function getCloudinarySignature() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Parameters to sign
    const params = {
      timestamp: timestamp,
      folder: "blog_images",
      // Add any other parameters you want to sign
    };

    // Generate the signature
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return {
      success: true,
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    };
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return {
      success: false,
      error: "Failed to generate signature",
    };
  }
}

/**
 * Directly uploads a file to Cloudinary from the server
 * This is more secure than client-side uploads
 */
export async function uploadToCloudinary(file: File) {
  try {
    // We need to convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "blog_images",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    return { success: true, result };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
