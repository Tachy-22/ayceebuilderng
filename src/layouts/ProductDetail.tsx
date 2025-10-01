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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Helper fu                   x
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // Reds
    Burgundy: "#800020",
    Garnet: "#733635",
    Apple: "#ff0800",
    Tomato: "#ff6347",
    Lipstick: "#ff5470",
    Strawberry: "#fc5a8d",

    // Oranges
    Pumpkin: "#ff7518",
    Persimmon: "#ec5800",
    Mango: "#fdbe02",
    Coral: "#ff7f50",

    // Yellows
    Mustard: "#ffdb58",
    Sunflower: "#ffda03",
    Butter: "#fffaa0",
    Canary: "#ffff99",

    // Greens
    Hunter: "#355e3b",
    Garden: "#4d8c57",
    Olive: "#808000",
    Chartreuse: "#7fff00",
    Lime: "#00ff00",
    Sage: "#bcb88a",
    Mint: "#98ff98",
    Leaf: "#71aa34",

    // Blues
    Royal: "#4169e1",
    Turquoise: "#40e0d0",
    Colonial: "#3a5b52",
    "French Blue": "#0072bb",
    "Sea Foam": "#71eeb8",
    "Robin's Egg": "#96deda",
    Sky: "#87ceeb",
    Frost: "#eef0f3",

    // Purples
    Merlot: "#73343a",
    Plum: "#8e4585",
    Grape: "#6f2da8",
    Lavender: "#e6e6fa",
    Periwinkle: "#ccccff",
    Lilac: "#c8a2c8",
    Mulberry: "#c54b8c",
    Fuchsia: "#ff00ff",

    // Pinks
    "Tea Rose": "#f88379",
    Baby: "#f4c2c2",
    Blush: "#de5d83",
    Breath: "#ffd6de",
    Nude: "#f2d2bd",
    Peach: "#ffe5b4",

    // Earth Tones
    Chick: "#ffef96",
    Terra: "#e2725b",
    Sand: "#c2b280",
    Chocolate: "#7b3f00",
    Fox: "#c35831",
    Fawn: "#e5aa70",
    Camel: "#c19a6b",
    Khaki: "#c3b091",
    Moss: "#8a9a5b",

    // Neutrals
    Black: "#000000",
    Dove: "#777777",
    Stone: "#928e85",

    // Metallics
    "Metallic Gold": "#d4af37",
    "Metallic Silver": "#c0c0c0",
    "Metallic Bronze": "#cd7f32",
  };

  return colorMap[colorName] || "#cccccc"; // Default gray if color not found
};

const getColorBorder = (colorName: string): string => {
  // Add a border to light colors for better visibility
  const lightColors = [
    "Butter",
    "Canary",
    "Frost",
    "Lavender",
    "Periwinkle",
    "Baby",
    "Breath",
    "Nude",
    "Peach",
    "Chick",
    "Metallic Silver",
  ];

  return lightColors.includes(colorName) ? "1px solid #aaaaaa" : "none";
};

import {
  Product,
  ProductNew,
  ProductVariant,
  mapNewProductToProduct,
  mapNewProductsToProducts,
} from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";

interface ProductDetailProps {
  mappedProducts?: Product[];
  rawProduct?: ProductNew;
}

const ProductDetail = ({ mappedProducts, rawProduct }: ProductDetailProps) => {
  console.log({ rawProduct });
  const fetchedMappedProduct = mapNewProductsToProducts([
    rawProduct as ProductNew,
  ])[0];

  console.log({ rawProduct, fetchedMappedProduct });

  const { id } = useParams();
  const { product: storedProduct } = useAppSelector(
    (state) => state.productSlice
  );
  const product = storedProduct ? storedProduct : fetchedMappedProduct;
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [centerColorIndex, setCenterColorIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Reset image index when product changes
    /// setCurrentImageIndex(0);

    // First try to find the product in the mapped products
    if (mappedProducts && mappedProducts.length > 0) {
      const foundProduct = mappedProducts.find((p) => p.id === id);
      if (foundProduct) {
        setTimeout(() => setIsLoaded(true), 100);
        return;
      }
    }

    // If we have a raw product, map it
    if (rawProduct) {
      const mappedProduct = mapNewProductToProduct(rawProduct, 0);
      setTimeout(() => setIsLoaded(true), 100);
      return;
    }

    // If we have a product from redux
    if (product) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [id, product, mappedProducts, rawProduct]);

  // Initialize selected color only for paint products
  useEffect(() => {
    if (product) {
      if (product.selectedColor) {
        setSelectedColor(product.selectedColor);
      } else if (product.category.toLowerCase() === "paint") {
        // Set default color only for paint products
        setSelectedColor("Burgundy");
      } else {
        // Clear color for non-paint products
        setSelectedColor(undefined);
      }
    }
  }, [product]);

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
  const handleAddToCart = () => {
    // Check if it's a paint product that requires color selection
    if (product.category.toLowerCase() === "paint" && !selectedColor) {
      // If paint product without selected color, show toast notification
      toast({
        title: "Color Selection Required",
        description:
          "Please select a color for this paint before adding to cart",
        variant: "destructive",
      });
      return;
    }

    // Create a product copy with the selected color and variant if needed
    const productToAdd = {
      ...product,
      ...(selectedColor && { selectedColor }),
      ...(selectedVariant && { selectedVariant }),
    };

    // Debug logging
    console.log('Adding to cart:', {
      product: productToAdd.name,
      selectedVariant,
      quantity,
      variantPrice: selectedVariant?.variant_price
    });

    // Add product to cart with variant
    addToCart(productToAdd, quantity, selectedVariant);

    const colorInfo = selectedColor ? ` (${selectedColor})` : "";
    const variantInfo = selectedVariant ? ` - ${selectedVariant.variant_name}` : "";
    toast({
      title: "Added to Cart",
      description: `${product.name}${variantInfo}${colorInfo} added to cart`,
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

  // Change the displayed image
  const changeImage = (index: number) => {
    if (index >= 0 && index < product.images.length) {
      setCurrentImageIndex(index);
    }
  };

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex flex-col">
      <main className="flex-grow pt-20">
        {/* Breadcrumbs */}
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
              href={`/products?category=${product.category}&page=1&limit=12`}
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
            {/* Product Image Column */}
            <div className="space-y-4">
              {/* Main Product Image */}
              <div className="bg-white rounded-xl overflow-hidden max-h-[30rem]">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[25rem] lg:h-[30rem] object-cover object-center "
                />
              </div>

              {/* Image Thumbnails */}
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

            {/* Product Info */}
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
                {/* Display variant price if selected, otherwise display original price */}
                {selectedVariant ? (
                  <div className="space-y-2">
                    <span className="text-3xl font-bold">
                      ₦{selectedVariant.variant_price.toLocaleString()}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      Base price: ₦{(hasDiscount && product.discountPrice ? product.discountPrice : product.price).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Select Variant</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-medium text-sm">{variant.variant_name}</div>
                        {/* <div className="text-lg font-bold">
                          ₦{variant.variant_price.toLocaleString()}
                        </div> */}
                        {!variant.inStock && (
                          <div className="text-xs text-red-500 mt-1">Out of Stock</div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedVariant && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      Selected: {selectedVariant.variant_name} - ₦{selectedVariant.variant_price.toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Features List - Quick view */}
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
              )}{" "}
              <div className="space-y-4">
                {/* Color Palette for Paint Products */}{" "}
                {product.category.toLowerCase() === "paint" &&
                  product.colors && (
                    <div className="mt-8 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          Select Your Paint Color
                        </h3>
                        {selectedColor && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full border"
                              style={{
                                backgroundColor: getColorHex(selectedColor),
                                border: getColorBorder(selectedColor),
                              }}
                            />
                            <span className="font-medium text-sm">
                              Selected: {selectedColor}
                            </span>
                          </div>
                        )}
                      </div>{" "}
                      <Carousel
                        opts={{
                          align: "center",
                          loop: true,
                          containScroll: false,
                          dragFree: true,
                        }}
                        className="w-full cursor-grab active:cursor-grabbing"
                      >
                        <CarouselContent className="-ml-4">
                          {[
                            // All colors in a flat array
                            "Burgundy",
                            "Garnet",
                            "Apple",
                            "Tomato",
                            "Strawberry",
                            "Lipstick",
                            "Pumpkin",
                            "Persimmon",
                            "Mango",
                            "Coral",
                            "Mustard",
                            "Sunflower",
                            "Butter",
                            "Canary",
                            "Hunter",
                            "Garden",
                            "Olive",
                            "Chartreuse",
                            "Lime",
                            "Sage",
                            "Mint",
                            "Leaf",
                            "Royal",
                            "Turquoise",
                            "Colonial",
                            "French Blue",
                            "Sea Foam",
                            "Robin's Egg",
                            "Sky",
                            "Frost",
                            "Merlot",
                            "Plum",
                            "Grape",
                            "Lavender",
                            "Periwinkle",
                            "Lilac",
                            "Mulberry",
                            "Fuchsia",
                            "Tea Rose",
                            "Baby",
                            "Blush",
                            "Breath",
                            "Nude",
                            "Peach",
                            "Chick",
                            "Terra",
                            "Sand",
                            "Chocolate",
                            "Fox",
                            "Fawn",
                            "Camel",
                            "Khaki",
                            "Moss",
                            "Black",
                            "Dove",
                            "Stone",
                            "Metallic Gold",
                            "Metallic Silver",
                            "Metallic Bronze",
                          ].map((color, index) => {
                            const isSelected = selectedColor === color;
                            // Determine color family
                            let colorFamily = "";
                            if (
                              [
                                "Burgundy",
                                "Garnet",
                                "Apple",
                                "Tomato",
                                "Strawberry",
                                "Lipstick",
                              ].includes(color)
                            ) {
                              colorFamily = "Reds";
                            } else if (
                              [
                                "Pumpkin",
                                "Persimmon",
                                "Mango",
                                "Coral",
                              ].includes(color)
                            ) {
                              colorFamily = "Oranges";
                            } else if (
                              [
                                "Mustard",
                                "Sunflower",
                                "Butter",
                                "Canary",
                              ].includes(color)
                            ) {
                              colorFamily = "Yellows";
                            } else if (
                              [
                                "Hunter",
                                "Garden",
                                "Olive",
                                "Chartreuse",
                                "Lime",
                                "Sage",
                                "Mint",
                                "Leaf",
                              ].includes(color)
                            ) {
                              colorFamily = "Greens";
                            } else if (
                              [
                                "Royal",
                                "Turquoise",
                                "Colonial",
                                "French Blue",
                                "Sea Foam",
                                "Robin's Egg",
                                "Sky",
                                "Frost",
                              ].includes(color)
                            ) {
                              colorFamily = "Blues";
                            } else if (
                              [
                                "Merlot",
                                "Plum",
                                "Grape",
                                "Lavender",
                                "Periwinkle",
                                "Lilac",
                                "Mulberry",
                                "Fuchsia",
                              ].includes(color)
                            ) {
                              colorFamily = "Purples";
                            } else if (
                              [
                                "Tea Rose",
                                "Baby",
                                "Blush",
                                "Breath",
                                "Nude",
                                "Peach",
                              ].includes(color)
                            ) {
                              colorFamily = "Pinks";
                            } else if (
                              [
                                "Chick",
                                "Terra",
                                "Sand",
                                "Chocolate",
                                "Fox",
                                "Fawn",
                                "Camel",
                                "Khaki",
                                "Moss",
                              ].includes(color)
                            ) {
                              colorFamily = "Earth Tones";
                            } else {
                              colorFamily = "Neutrals & Metallics";
                            }

                            return (
                              <CarouselItem
                                key={color}
                                className="pl-4 md: basis-1/5 lg:basis-1/7"
                              >
                                <div
                                  className={`flex flex-col items-center transition-all duration-300 ${
                                    isSelected ? "scale-105" : ""
                                  }`}
                                >
                                  <div
                                    className={`relative group ${
                                      isSelected ? "z-10" : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedColor(color);
                                      toast({
                                        title: "Color selected",
                                        description: `${color} selected for ${product.name}`,
                                      });
                                    }}
                                  >
                                    <div
                                      className={`
                                          cursor-pointer 
                                          transition-all duration-300
                                          shadow-md hover:shadow-lg
                                          ${
                                            isSelected
                                              ? "ring-4 scale-[90%] ring-primary ring-opacity-70"
                                              : "hover:scale-[80%] scale-[60%]  hover:opacity-100"
                                          }
                                          ${"w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 "}
                                          rounded-md
                                        `}
                                      style={{
                                        backgroundColor: getColorHex(color),
                                        border: getColorBorder(color),
                                        transition: "all 0.4s ease-in-out",
                                      }}
                                    />
                                    {/* Subtle glow effect for selected color */}
                                    {isSelected && (
                                      <div
                                        className="absolute inset-0 rounded-md blur-sm -z-10 "
                                        style={{
                                          backgroundColor: getColorHex(color),
                                        }}
                                      ></div>
                                    )}
                                    {/* Color Name and Family Display */}
                                    <div
                                      className={`
                                      absolute -bottom-12 left-1/2 -translate-x-1/2 w-max
                                      transition-all duration-300
                                      ${
                                        isSelected
                                          ? "opacity-100 scale-100"
                                          : " scale-95"
                                      }
                                    `}
                                    >
                                      <div className="text-center">
                                        <p
                                          className={`font-medium whitespace-nowrap ${
                                            isSelected
                                              ? "text-primary text-sm"
                                              : "text-xs"
                                          }`}
                                        >
                                          {color}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {colorFamily}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        {/* Left mask for fade effect */}
                        <div className="absolute left-0 top-0 h-full w-12 md:w-20 bg-gradient-to-r from-white via-white to-transparent z-10"></div>

                        {/* Right mask for fade effect */}
                        <div className="absolute right-0 top-0 h-full w-12 md:w-20 bg-gradient-to-l from-white via-white to-transparent z-10"></div>
                        <div className="flex items-center justify-center gap-8 mt-16">
                          <CarouselPrevious className="static" />
                          <CarouselNext className="static" />
                        </div>
                      </Carousel>
                    </div>
                  )}
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
              </TabsList>{" "}
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  {product.description &&
                  product.description !== "No description available" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description
                          .replace(/\n/g, "<br />")
                          .replace(/• /g, "&bull; ")
                          .replace(/•/g, "&bull;")
                          .replace(/\* /g, "&bull; ")
                          .replace(/\*/g, "&bull;")
                          .replace(/-\s+/g, "&ndash; ")
                          .split("<br />")
                          .map((line) =>
                            line.trim().startsWith("&bull;") ||
                            line.trim().startsWith("&ndash;")
                              ? `<div class="flex items-start mb-2">
                              <span class="inline-block w-4 mr-2 text-primary flex-shrink-0">${
                                line.trim().startsWith("&bull;") ? "•" : "-"
                              }</span>
                              <span>${line.replace(
                                /^(&bull;|&ndash;)\s*/,
                                ""
                              )}</span>
                             </div>`
                              : `<p class="mb-3">${line}</p>`
                          )
                          .join(""),
                      }}
                      className="space-y-2"
                    />
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
