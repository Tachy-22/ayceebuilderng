import { transformCloudinaryUrl } from "@/lib/cloudinary";

/**
 * Helper component to optimize blog image URLs using Cloudinary
 * @param imageUrl Original image URL
 * @param size Image size (thumbnail, medium, large)
 * @returns Optimized image URL
 */
export const optimizeBlogImage = (
  imageUrl: string | undefined,
  size: "thumbnail" | "medium" | "large" = "medium"
): string => {
  // Default fallback image
  const fallbackImage = "/hero-img2.jpg";

  // If no image URL provided, return fallback
  if (!imageUrl) {
    return fallbackImage;
  }

  // If not a Cloudinary URL, return as is
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  // Apply different transformations based on requested size
  switch (size) {
    case "thumbnail":
      return transformCloudinaryUrl(imageUrl, {
        width: 400,
        height: 300,
        crop: "fill",
        quality: 80,
        format: "auto",
      });

    case "medium":
      return transformCloudinaryUrl(imageUrl, {
        width: 800,
        height: 600,
        crop: "fill",
        quality: 80,
        format: "auto",
      });

    case "large":
      return transformCloudinaryUrl(imageUrl, {
        width: 1200,
        quality: 85,
        format: "auto",
      });

    default:
      return imageUrl;
  }
};

/**
 * Gets image dimensions for Next.js Image component
 * @param imageUrl Cloudinary image URL
 * @param size Image size preset
 * @returns Object with width and height values
 */
export const getImageDimensions = (
  imageUrl: string | undefined,
  size: "thumbnail" | "medium" | "large" = "medium"
): { width: number; height: number } => {
  if (!imageUrl) {
    // Default dimensions for fallback image
    return { width: 1200, height: 800 };
  }

  switch (size) {
    case "thumbnail":
      return { width: 400, height: 300 };
    case "medium":
      return { width: 800, height: 600 };
    case "large":
      return { width: 1200, height: 900 };
    default:
      return { width: 1200, height: 800 };
  }
};

/**
 * Creates a responsive image sizes string for Next.js Image component
 * @returns Sizes string for responsive image loading
 */
export const getResponsiveSizes = (
  variant: "thumbnail" | "card" | "hero" | "full" = "card"
): string => {
  switch (variant) {
    case "thumbnail":
      return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw";
    case "card":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    case "hero":
      return "100vw";
    case "full":
      return "(max-width: 1024px) 100vw, 1200px";
    default:
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  }
};
