export interface ProductVariant {
  id: string;
  variant_name: string;
  variant_price: number;
  inStock?: boolean;
}

export interface Product {
  id: string;
  createdAt?: Date;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  image: string; // Main image (first in the array)
  images: string[]; // Array of all product images
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  location: string; // New field for product location
  vendor: {
    name: string;
    rating: number;
    verified: boolean;
  };
  weight: number;
  colors?: string[]; // Array of available colors
  selectedColor?: string; // Selected color
  variants?: ProductVariant[]; // Array of product variants
  selectedVariant?: ProductVariant; // Currently selected variant
}

export const categories = [
  { id: "tiles", name: "Tiles", icon: "🔲", itemCount: 20 },

  { id: "electrical", name: "Electrical", icon: "⚡", itemCount: 22 },
  { id: "paint", name: "Paint", icon: "🎨", itemCount: 10 },
  { id: "sanitaryware", name: "Sanitary Ware", icon: "🚰", itemCount: 12 },
  { id: "cladding", name: "Cladding", icon: "🧱", itemCount: 14 },
  {
    id: "adhesive and admix",
    name: "Adhesive and Admix",
    icon: "🧪",
    itemCount: 9,
  },
  { id: "plumbing", name: "Plumbing", icon: "💧", itemCount: 18 },
  { id: "lighting", name: "Lighting", icon: "🔲", itemCount: 20 },
];

export interface ProductNew {
  // Update to handle both string, object, and array formats for images
  image?: { src: string } | string | null;
  images?: string[]; // New field for array of images
  Category?: string;
  SubCategory?: string;
  CostPrice?: number;
  Profit?: number;
  rating?: number;
  reviewCount?: number;
  weight?: number;
  Price: number;
  discountedPrice?: number;
  Description?: string;
  Specification?: string; // Format: "key1:value1,key2:value2,..."
  inStock?: boolean;
  Features?: string; // Features as comma-separated string
  Title: string;
  sheetName: string;
  Vendor?: string;
  features: string[];
  id?: number;
  specifications: Record<string, string>;
  location?: string; // New location field in raw data
  colors?: string; // Colors as comma-separated string
  Colors?: string; // Alternative capitalization for colors
  name?: string;
  price?: number;
  discountPrice?: number;
  category?: string;
  subCategory?: string;
  variants?: ProductVariant[] | string; // Variants as array or string format
  Variants?: string; // Alternative capitalization for variants
}

// Helper function to parse specifications string into object
function parseSpecifications(specString: string): Record<string, string> {
  if (!specString || typeof specString !== "string") return {};

  const result: Record<string, string> = {};
  try {
    // Log the raw specification string for debugging
    console.log("Raw specifications:", specString);

    // Split by comma, then by colon
    const specs = specString.split(",");

    specs.forEach((spec) => {
      // Check for colon as separator
      if (spec.includes(":")) {
        const [key, value] = spec.split(":");
        if (key && value) {
          // Remove any quotes around the value
          const cleanValue = value.trim().replace(/^['"]|['"]$/g, "");
          result[key.trim()] = cleanValue;
        }
      }
      // Special handling for "Colors = 'Red,Yellow'" format
      else if (spec.includes("=")) {
        const [key, value] = spec.split("=");
        if (key && value) {
          // Remove any quotes around the value
          const cleanValue = value.trim().replace(/^['"]|['"]$/g, "");
          result[key.trim()] = cleanValue;
        }
      }
    });

    console.log("Parsed specifications:", result);
    return result;
  } catch (error) {
    console.error("Error parsing specifications:", error);
    return {};
  }
}

// Helper function to parse features string into array
function parseFeatures(featuresString: string): string[] {
  if (!featuresString || typeof featuresString !== "string") return [];

  try {
    // Split by comma or handle as single feature
    return featuresString.includes(",")
      ? featuresString
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
      : [featuresString.trim()];
  } catch (error) {
    console.error("Error parsing features:", error);
    return [];
  }
}

// Helper function to parse colors string into array
function parseColors(colorsString: string): string[] {
  if (!colorsString || typeof colorsString !== "string") return [];

  try {
    // Remove any quotes around the string
    const cleanString = colorsString.replace(/^['"]|['"]$/g, "");
    console.log("Parsing colors from:", cleanString);

    // Split by comma or handle as single color
    return cleanString.includes(",")
      ? cleanString
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
      : [cleanString.trim()];
  } catch (error) {
    console.error("Error parsing colors:", error);
    return [];
  }
}

// Helper function to parse variants string into array
function parseVariants(variantsString: string): ProductVariant[] {
  if (!variantsString || typeof variantsString !== "string") return [];

  try {
    // Handle JSON format first
    try {
      const parsed = JSON.parse(variantsString);
      if (Array.isArray(parsed)) {
        return parsed.map((variant, index) => ({
          id: variant.id || `variant-${index}`,
          variant_name: variant.variant_name || variant.name || `Variant ${index + 1}`,
          variant_price: Number(variant.variant_price || variant.price || 0),
          inStock: variant.inStock !== false
        }));
      }
    } catch (jsonError) {
      // Not JSON, try other formats
    }

    // Handle custom format: "name1:price1,name2:price2"
    const variants: ProductVariant[] = [];
    const variantPairs = variantsString.split(',');

    variantPairs.forEach((pair, index) => {
      const [name, price] = pair.split(':').map(s => s.trim());
      if (name && price) {
        variants.push({
          id: `variant-${index}`,
          variant_name: name,
          variant_price: Number(price) || 0,
          inStock: true
        });
      }
    });

    return variants;
  } catch (error) {
    console.error("Error parsing variants:", error);
    return [];
  }
}

// Helper function to convert ProductNew to Product format
export function mapNewProductToProduct(
  product: ProductNew,
  index: number
): Product {
  try {
    // Check if product is null or undefined
    if (!product) {
      throw new Error("Product is undefined or null");
    }

    // Log raw product data for debugging
    console.log("Raw product data:", {
      id: product.id || "unknown",
      title: product.Title || "No Title",
      colors: product.colors || "none",
      Colors: product.Colors || "none",
      specification: product.Specification || "none",
    }); // Parse specifications - handle both object and string formats
    let specifications: Record<string, string> = {};
    if (product.specifications) {
      specifications = typeof product.specifications === 'object' ? product.specifications : parseSpecifications(product.specifications);
    } else if (product.Specification) {
      specifications = typeof product.Specification === 'object' ? product.Specification : parseSpecifications(product.Specification);
    }

    // Parse features safely - handle both array and string formats
    let features: string[] = [];
    if (product.features) {
      features = Array.isArray(product.features) ? product.features : parseFeatures(product.features);
    } else if (product.Features) {
      features = Array.isArray(product.Features) ? product.Features : parseFeatures(product.Features);
    }

    // Parse colors either from dedicated field or from specifications
    let colors: string[] = [];

    // Check for direct colors field (from colors property in product data)
    if (product.colors) {
      colors = parseColors(product.colors);
      console.log("Colors from product.colors:", colors);
    }
    // Check for Colors property directly in the product (independent of specs)
    else if (product.Colors) {
      colors = parseColors(product.Colors);
      console.log("Colors from product.Colors:", colors);
    }
    // Check in specifications with different capitalizations
    else if (specifications.Colors) {
      colors = parseColors(specifications.Colors);
      console.log("Colors from specifications.Colors:", colors);
    } else if (specifications.colors) {
      colors = parseColors(specifications.colors);
      console.log("Colors from specifications.colors:", colors);
    } else if (specifications.Color) {
      colors = parseColors(specifications.Color);
      console.log("Colors from specifications.Color:", colors);
    } else if (specifications.color) {
      colors = parseColors(specifications.color);
      console.log("Colors from specifications.color:", colors);
    }

    // Look for specific "Colors" property that may not be in specifications
    if (colors.length === 0 && typeof product.Specification === "string") {
      // Try to extract Colors directly from the specification string
      const colorsMatch = product.Specification.match(
        /Colors\s*[:=]\s*['"]([^'"]+)['"]/i
      );
      if (colorsMatch && colorsMatch[1]) {
        colors = parseColors(colorsMatch[1]);
        console.log("Colors extracted from spec string:", colors);
      }
    }

    // Log the extracted colors
    console.log("Extracted colors:", {
      productId: product.id,
      productTitle: product.Title,
      colors: colors,
    });

    // For paint products, ensure at least one color is available
    if (product.sheetName?.toLowerCase() === "paint" && colors.length === 0) {
      colors = ["White"];
    }

    // Parse variants similarly to colors
    let variants: ProductVariant[] = [];

    // Check for variants in different possible fields
    if (product.variants) {
      if (Array.isArray(product.variants)) {
        variants = product.variants;
      } else if (typeof product.variants === 'string') {
        variants = parseVariants(product.variants);
      }
    } else if (product.Variants) {
      variants = parseVariants(product.Variants);
    }

    // Log extracted variants
    console.log("Extracted variants:", {
      productId: product.id,
      productTitle: product.Title,
      variants: variants,
    });

    // Handle image arrays and different image formats
    let imageUrl = "https://placehold.co/600x400?text=No+Image";
    let imageArray: string[] = [];

    try {
      // If we have an images array, use that
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        // Filter out any null or undefined values
        const validImages = product.images.filter(Boolean);
        if (validImages.length > 0) {
          imageArray = validImages;
          imageUrl = validImages[0]; // Use first image as main image
        }
      }
      // Otherwise check for single image field
      else if (typeof product.image === "string" && product.image) {
        imageUrl = product.image;
        imageArray = [product.image]; // Create an array with the single image
      } else if (
        product.image &&
        typeof product.image === "object" &&
        "src" in product.image &&
        product.image.src
      ) {
        imageUrl = product.image.src;
        imageArray = [product.image.src]; // Create an array with the single image
      } else {
        imageArray = [imageUrl]; // Use placeholder as array
      }
    } catch (error) {
      console.error("Error processing product images:", error);
      // Fall back to placeholder image
      imageUrl = "https://placehold.co/600x400?text=Image+Error";
      imageArray = [imageUrl];
    }

    // Ensure we always have at least one image in the array
    if (imageArray.length === 0) {
      imageArray = [imageUrl];
    }

    return {
      id: product.id?.toString() || index.toString(),
      createdAt: new Date(),
      name: product.name || product.Title || "Untitled Product",
      category:
        product.category?.toLowerCase() ||
        product.sheetName?.toLowerCase() ||
        product.Category?.toLowerCase() ||
        "uncategorized",
      subCategory: product.subCategory || product.SubCategory || undefined,
      price:
        (Number(product.discountPrice) || Number(product.discountedPrice))
          ? (Number(product.price) || Number(product.Price) || 0)
          : ((Number(product.price) || Number(product.Price) || 0) * 0.95),
      discountPrice:
        Number(product.discountPrice) ||
        Number(product.discountedPrice) ||
        (Number(product.price) || Number(product.Price) || 0),
      image: imageUrl,
      images: imageArray,
      rating: product.rating || 4.0,
      reviewCount: product.reviewCount || 0,
      description: product.Description || "No description available",
      features: features,
      specifications: specifications,
      inStock: product.inStock === false ? false : true,
      featured: false, // Not available in ProductNew interface
      bestSeller: false, // Not available in ProductNew interface
      new: false, // Not available in ProductNew interface
      location:
        product.location ||
        "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja",
      vendor: {
        name: product.Vendor || "Aycee Builder",
        rating: 4.5, // Default rating since not in ProductNew
        verified: true, // Default verified since not in ProductNew
      },
      weight: product.weight || 0,
      colors: colors.length > 0 ? colors : undefined,
      selectedColor: undefined,
      variants: variants.length > 0 ? variants : undefined,
      selectedVariant: undefined,
    };
  } catch (error) {
    console.error("Error mapping product:", error, product);
    // Default fallback product with placeholder image
    const fallbackImageUrl =
      "https://placehold.co/600x400?text=Error+Loading+Product";
    return {
      id: index.toString(),
      name: product.Title || "Product Data Error",
      category: "uncategorized",
      price: 0,
      image: fallbackImageUrl,
      images: [fallbackImageUrl],
      rating: 0,
      reviewCount: 0,
      description: "There was an error loading this product's data.",
      features: [],
      specifications: {},
      inStock: false,
      location: "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja",
      vendor: {
        name: "Unknown",
        rating: 0,
        verified: false,
      },
      weight: 0,
      colors: [], // Empty colors array for fallback product
      variants: [], // Empty variants array for fallback product
    };
  }
}

// Function to convert an array of ProductNew to Product format with error handling
export function mapNewProductsToProducts(products: ProductNew[]): Product[] {
  if (!Array.isArray(products)) {
    console.error("Expected products array, received:", products);
    return [];
  }
  // Log the first product to see its structure
  if (products && products.length > 0 && products[0]) {
    try {
      console.log("First product structure:", {
        keys: Object.keys(products[0] || {}),
        hasColors: products[0] && "Colors" in products[0],
        hasLowerColors: products[0] && "colors" in products[0],
        colorValue: products[0]?.Colors || "none",
        specification: products[0]?.Specification,
      });
    } catch (error) {
      console.log("Error logging product structure:", error);
    }
  }

  console.log({ seeNow: products });

  return products.map((product, index) => {
    try {
      return mapNewProductToProduct(product, index);
    } catch (error) {
      console.error(`Error mapping product at index ${index}:`, error);
      // Return a fallback product
      return {
        id: index.toString(),
        name: "Product Data Error",
        category: "uncategorized",
        price: 0,
        image: "https://placehold.co/600x400?text=Error+Loading+Product",
        images: ["https://placehold.co/600x400?text=Error+Loading+Product"],
        rating: 0,
        reviewCount: 0,
        description: "There was an error loading this product's data.",
        features: [],
        specifications: {},
        inStock: false,
        location: "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja",
        vendor: {
          name: "Unknown",
          rating: 0,
          verified: false,
        },
        weight: 0,
        colors: [], // Empty colors array for fallback product
        variants: [], // Empty variants array for fallback product
      };
    }
  });
}

// Pagination interface for managing product loading
export interface PaginationInfo {
  currentPage: number;
  limit: number;
  hasMore: boolean;
  sheet?: string;
}

// Function to fetch more products with pagination
export async function fetchMoreProducts(
  apiUrl: string,
  pagination: PaginationInfo
): Promise<{
  products: ProductNew[];
  pagination: PaginationInfo;
}> {
  const { currentPage, limit, sheet = "all" } = pagination;
  const nextPage = currentPage + 1;

  const url = `${apiUrl}?page=${nextPage}&limit=${limit}&sheet=${sheet}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch more products");
  }

  const newProducts: ProductNew[] = await response.json();

  return {
    products: newProducts,
    pagination: {
      currentPage: nextPage,
      limit,
      hasMore: newProducts.length >= limit, // If we got a full page, assume there are more
      sheet,
    },
  };
}

// Function to fetch products for a specific category/sheet
export async function fetchProductsByCategory(
  apiUrl: string,
  sheet: string,
  page = 1,
  limit = 10
): Promise<{
  products: ProductNew[];
  pagination: PaginationInfo;
}> {
  const url = `${apiUrl}?page=${page}&limit=${limit}&sheet=${sheet}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products for ${sheet}`);
  }

  const products: ProductNew[] = await response.json();

  return {
    products,
    pagination: {
      currentPage: page,
      limit,
      hasMore: products.length >= limit,
      sheet,
    },
  };
}
