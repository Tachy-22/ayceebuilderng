"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  Truck,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Product, ProductNew, mapNewProductsToProducts } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";

interface ProductDetailProps {
  mappedProducts?: Product[];
  rawProduct: ProductNew | null;
}

const ProductDetail = ({ mappedProducts, rawProduct }: ProductDetailProps) => {
  const fetchedMappedProduct = mapNewProductsToProducts([
    rawProduct as ProductNew,
  ])[0];
  console.log({ rawProduct, fetchedMappedProduct });

  const { id } = useParams();
  const { product: storedProduct } = useAppSelector(
    (state) => state.productSlice
  );
  const product = storedProduct ? storedProduct : fetchedMappedProduct;

  // Log the product to help with debugging color data
  console.log("Product with colors:", {
    productColors: product.colors,
    specs: product.specifications,
  });

  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // This function maps common paint color names to their CSS color values
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      white: "#FFFFFF",
      "off-white": "#F5F5F5",
      ivory: "#FFFFF0",
      cream: "#FFFDD0",
      beige: "#F5F5DC",
      eggshell: "#F0EAD6",
      "light gray": "#D3D3D3",
      silver: "#C0C0C0",
      gray: "#808080",
      charcoal: "#36454F",
      pewter: "#899499",
      "sky blue": "#87CEEB",
      "baby blue": "#89CFF0",
      "powder blue": "#B0E0E6",
      "navy blue": "#000080",
      "royal blue": "#4169E1",
      teal: "#008080",
      turquoise: "#40E0D0",
      cyan: "#00FFFF",
      aqua: "#00FFFF",
      periwinkle: "#CCCCFF",
      "steel blue": "#4682B4",
      blue: "#0000FF",
      mint: "#98FB98",
      "lime green": "#32CD32",
      "forest green": "#228B22",
      "olive green": "#808000",
      sage: "#BCB88A",
      emerald: "#50C878",
      seafoam: "#71EEB8",
      green: "#008000",
      lemon: "#FFF44F",
      butter: "#F0E36B",
      marigold: "#EAA221",
      mustard: "#E1AD01",
      gold: "#FFD700",
      amber: "#FFBF00",
      tangerine: "#F28500",
      peach: "#FFE5B4",
      coral: "#FF7F50",
      orange: "#FFA500",
      apricot: "#FBCEB1",
      yellow: "#FFFF00",
      pink: "#FFC0CB",
      rose: "#FF007F",
      fuchsia: "#FF00FF",
      magenta: "#FF00FF",
      burgundy: "#800020",
      maroon: "#800000",
      crimson: "#DC143C",
      rust: "#B7410E",
      salmon: "#FA8072",
      terracotta: "#E2725B",
      cherry: "#DE3163",
      red: "#FF0000",
      lavender: "#E6E6FA",
      lilac: "#C8A2C8",
      plum: "#8E4585",
      violet: "#8F00FF",
      amethyst: "#9966CC",
      indigo: "#4B0082",
      purple: "#800080",
      tan: "#D2B48C",
      khaki: "#C3B091",
      caramel: "#C68E17",
      taupe: "#483C32",
      chocolate: "#7B3F00",
      mahogany: "#4A0100",
      coffee: "#6F4E37",
      mocha: "#A38068",
      brown: "#964B00",
      "jet black": "#000000",
      onyx: "#353839",
      black: "#000000",
    };

    const lowerColorName = colorName.toLowerCase().trim();
    if (lowerColorName in colorMap) {
      return colorMap[lowerColorName];
    }

    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColorName.includes(key) || key.includes(lowerColorName)) {
        return value;
      }
    }

    return "#D3D3D3";
  };

  const getProductColors = (): string[] => {
    console.log("Getting product colors from:", {
      productColors: product.colors,
      specifications: product.specifications,
    });

    // First, check if we have colors from the product model directly
    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.colors.length > 0
    ) {
      console.log("Using colors directly from product.colors");
      return product.colors;
    }

    // Otherwise check from specifications with different case variations
    if (product.specifications) {
      for (const key of Object.keys(product.specifications)) {
        if (key.toLowerCase() === "colors" || key.toLowerCase() === "color") {
          console.log(`Using colors from specifications.${key}`);
          const colorsValue = product.specifications[key];
          return colorsValue.split(",").map((color) => color.trim());
        }
      }
    }

    // Only return common colors for paint products
    if (product.category.toLowerCase() === "paint") {
      console.log("Using default color for paint product");
      return ["White"];
    }

    console.log("No colors found for product");
    return [];
  };

  const productColors = getProductColors();
  useEffect(() => {
    if (productColors.length > 0 && !selectedColor) {
      setSelectedColor(productColors[0]);
    }
  }, [product, productColors, productColors.length, selectedColor]);

  const handleAddToCart = () => {
    const productWithColor =
      selectedColor && productColors.length > 0
        ? { ...product, selectedColor }
        : product;

    addToCart(productWithColor, quantity);

    toast({
      title: "Added to Cart",
      description: `${product.name} ${
        selectedColor ? `(${selectedColor})` : ""
      } added to cart`,
    });
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  const changeImage = (index: number) => {
    if (index >= 0 && index < product.images.length) {
      setCurrentImageIndex(index);
    }
  };

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const wishlisted = isInWishlist(product.id);

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col">
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link
              href={`/products?sheet=${product.category}&page=1&limit=12`}
              className="hover:text-foreground"
            >
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-foreground truncate">{product.name}</span>
          </div>
        </div>

        <div
          className={`container mx-auto px-4 py-8 transition-opacity duration-500 ${
            product ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="bg-secondary/20 rounded-xl overflow-hidden max-h-[30rem]">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[25rem] lg:h-[30rem] object-cover object-center"
                />
              </div>

              {product.images.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-start">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 border-2 rounded overflow-hidden ${
                        currentImageIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: product.rating }).map((_, id) => (
                      <Star
                        key={id}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}

                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {product.reviewCount} reviews
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span
                    className={
                      product.inStock ? "text-green-600" : "text-red-500"
                    }
                  >
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>
              </div>
              <div>
                {hasDiscount && product.discountPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ₦{product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm">
                      {Math.round(
                        ((product.price - product.discountPrice) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {product.features && product.features.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check
                          size={16}
                          className="text-green-600 mr-2 mt-1 flex-shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {productColors.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">
                    <span className="flex items-center">
                      <Palette size={16} className="mr-2 text-primary" />
                      Color Options
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {productColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="group relative focus:outline-none"
                        aria-label={`Select ${color} color`}
                      >
                        <div
                          className={`h-[1rem] w-[1rem] rounded-full transition-transform ${
                            selectedColor === color
                              ? "ring-2 ring-primary scale-110 shadow-sm"
                              : "ring-1 ring-gray-200 hover:scale-105"
                          }`}
                          style={{ backgroundColor: getColorValue(color) }}
                        />
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* <div className="bg-white rounded-full p-0.5">
                              <Check size={12} className="text-primary" />
                            </div> */}
                          </div>
                        )}
                        <span className="sr-only">{color}</span>
                      </button>
                    ))}
                  </div>
                  {selectedColor && (
                    <div className="mt-4 text-sm font-medium text-primary">
                      Selected: {selectedColor}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-medium">-</span>
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <span className="text-xl font-medium">+</span>
                    </Button>
                  </div>

                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className={`flex-1 ${
                      wishlisted ? "border-primary text-primary" : ""
                    }`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart
                      size={18}
                      className={`mr-2 ${wishlisted ? "fill-primary" : ""}`}
                    />
                    {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 text-sm">
                  <Truck
                    size={18}
                    className="text-muted-foreground flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="font-medium">Delivery:</span> Available
                    nationwide.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b rounded-none justify-start">
                <TabsTrigger value="description" className="text-base">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="text-base">
                  Specifications
                </TabsTrigger>
                {product.features && product.features.length > 0 && (
                  <TabsTrigger value="features" className="text-base">
                    Features
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  {product.description &&
                  product.description !== "No description available" ? (
                    <>
                      <div
                        className={`product-description ${
                          !isDescriptionExpanded
                            ? "max-h-[300px] overflow-hidden relative border-b-2 border-gray-100"
                            : ""
                        }`}
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof product.description === "string"
                              ? product.description
                                  .replace(
                                    /\n\s*\n([A-Z][^a-z\n]{2,}.*?)(?=\n)/g,
                                    '</p><h3 class="text-lg font-semibold mt-5 mb-3">$1</h3><p class="mb-3">'
                                  )
                                  .replace(
                                    /\n(\d+\.\s+.*?)(?=\n\d+\.|$)/g,
                                    '</p><ol class="list-decimal pl-5 mb-4"><li class="mb-2">$1</li></ol><p class="mb-3">'
                                  )
                                  .replace(
                                    /\n[-•*]\s+(.*?)(?=\n[-•*]|$)/g,
                                    '</p><ul class="list-disc pl-5 mb-4"><li class="mb-2">$1</li></ul><p class="mb-3">'
                                  )
                                  .replace(
                                    /<\/ul><p class="mb-3">\n[-•*]\s+(.*?)(?=\n[-•*]|$)/g,
                                    '<li class="mb-2">$1</li>'
                                  )
                                  .replace(/\n\s*\n/g, '</p><p class="mb-3">')
                                  .replace(/\n/g, "<br />")
                                  .replace(/- /g, "• ")
                                  .replace(
                                    /• (.*?)(?=<br \/>|<\/p>)/g,
                                    '<span class="flex items-start mb-2"><span class="text-primary mr-2 flex-shrink-0">•</span>$1</span>'
                                  )
                                  .replace(
                                    /^(.+?)(?=<\/p>|<h3|<ul|<ol)/,
                                    '<p class="mb-3">$1'
                                  )
                                  .replace(/([^>])$/, "$1</p>")
                                  .replace(/<p class="mb-3"><\/p>/g, "")
                              : "No description available",
                        }}
                      />
                      <button
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className="flex items-center text-primary font-medium mt-4 mb-2 hover:underline focus:outline-none"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            <span>Show more</span>
                            <ChevronDown size={16} className="ml-1" />
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <p>
                      This premium construction material is designed to meet the
                      highest industry standards and is suitable for both
                      professional and DIY construction projects. Built with
                      durability in mind, it will withstand the test of time and
                      environmental conditions.
                    </p>
                  )}
                </div>
                <style jsx>{`
                  .product-description p {
                    margin-bottom: 0.75rem;
                  }
                  .product-description h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    color: hsl(160, 64%, 45%);
                  }
                  .product-description ul,
                  .product-description ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .product-description li {
                    margin-bottom: 0.5rem;
                  }
                  .product-description ul li {
                    list-style-type: disc;
                  }
                  .product-description ol li {
                    list-style-type: decimal;
                  }
                  .product-description span.flex {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                  }
                  .product-description span.flex span:first-child {
                    color: hsl(160, 64%, 55%);
                    font-weight: bold;
                    margin-right: 0.5rem;
                    flex-shrink: 0;
                  }
                `}</style>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Technical Specifications
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="grid grid-cols-2 border-b pb-2"
                          >
                            <span className="text-muted-foreground capitalize">
                              {key}
                            </span>
                            <span>{value as unknown as string}</span>
                          </div>
                        )
                      )}
                      {Object.keys(product.specifications).length === 0 && (
                        <div className="text-muted-foreground">
                          No specifications available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Packaging Information
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">
                          Package Contents
                        </span>
                        <span>1 unit</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">
                          Package Weight
                        </span>
                        <span>{product.weight || "N/A"} Kg</span>
                      </div>
                      <div className="grid grid-cols-2 border-b pb-2">
                        <span className="text-muted-foreground">
                          Country of Origin
                        </span>
                        <span>Nigeria</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="features" className="mt-6">
                <div className="prose max-w-none">
                  <ul className="space-y-3">
                    {product.features && product.features.length > 0 ? (
                      product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check
                            size={18}
                            className="text-green-600 mr-2 mt-1 flex-shrink-0"
                          />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li>No additional features available.</li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
