/**
 * Cloudinary utility functions for image manipulation and optimization
 */

/**
 * Transform a Cloudinary URL to apply various transformations
 * @param url The original Cloudinary URL
 * @param options Transformation options
 * @returns The transformed URL
 */
export const transformCloudinaryUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "scale" | "fit" | "thumb" | "crop";
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
    effect?: string;
  }
): string => {
  if (!url || !url.includes("cloudinary.com")) {
    return url; // Return original URL if not a Cloudinary URL
  }

  try {
    // Parse the URL to get the base and file path
    const urlParts = url.split("/upload/");
    if (urlParts.length !== 2) return url;

    const base = urlParts[0];
    const file = urlParts[1];

    // Build transformation string
    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.effect) transformations.push(`e_${options.effect}`); // If no transformations, return original URL
    if (transformations.length === 0) return url;

    // Check if the URL already has version number (v1234567890)
    const hasVersion = /\/v\d+\//.test(file);

    if (hasVersion) {
      // If URL already has version, insert transformations before version
      const [version, filename] = file.split("/", 2);
      return `${base}/upload/${transformations.join(
        ","
      )}/${version}/${filename}`;
    } else {
      // Otherwise, add transformations and a cache-busting version
      return `${base}/upload/${transformations.join(
        ","
      )}/v${Date.now()}/${file}`;
    }
  } catch (error) {
    console.error("Error transforming Cloudinary URL:", error);
    return url; // Return original URL on error
  }
};

/**
 * Get an optimized thumbnail version of a Cloudinary image
 * @param url The original Cloudinary URL
 * @param width Thumbnail width (default: 300)
 * @param height Thumbnail height (default: 200)
 * @returns Optimized thumbnail URL
 */
export const getCloudinaryThumbnail = (
  url: string,
  width = 300,
  height = 200
): string => {
  return transformCloudinaryUrl(url, {
    width,
    height,
    crop: "fill",
    quality: 80,
    format: "auto",
  });
};

/**
 * Get a responsive image URL for different screen sizes
 * @param url The original Cloudinary URL
 * @param sizes Various sizes configurations
 * @returns Object with URLs for different sizes
 */
export const getResponsiveImageUrl = (
  url: string,
  sizes: { sm?: number; md?: number; lg?: number; xl?: number }
): { [key: string]: string } => {
  const result: { [key: string]: string } = {};

  if (sizes.sm) {
    result.sm = transformCloudinaryUrl(url, {
      width: sizes.sm,
      quality: 80,
      format: "auto",
    });
  }

  if (sizes.md) {
    result.md = transformCloudinaryUrl(url, {
      width: sizes.md,
      quality: 80,
      format: "auto",
    });
  }

  if (sizes.lg) {
    result.lg = transformCloudinaryUrl(url, {
      width: sizes.lg,
      quality: 80,
      format: "auto",
    });
  }

  if (sizes.xl) {
    result.xl = transformCloudinaryUrl(url, {
      width: sizes.xl,
      quality: 80,
      format: "auto",
    });
  }

  return result;
};

/**
 * Extract the public ID from a Cloudinary URL
 * Useful for identifying images when deleting them
 */
export const getCloudinaryPublicId = (url: string): string | null => {
  if (!url || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    // Extract public ID from URL (format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/public-id)
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match && match[1]) {
      // Remove any transformations or query parameters
      return match[1].split(".")[0];
    }
    return null;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return null;
  }
};

export default {
  transformCloudinaryUrl,
  getCloudinaryThumbnail,
  getResponsiveImageUrl,
  getCloudinaryPublicId,
};
