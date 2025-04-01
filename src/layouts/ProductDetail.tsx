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
  Product,
  ProductNew,
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
    // Add product to cart
    addToCart(product, quantity);

    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
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
            {/* Product Image Column */}
            <div className="space-y-4">
              {/* Main Product Image */}
              <div className="bg-secondary/20 rounded-xl overflow-hidden max-h-[30rem]">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[25rem] lg:h-[30rem] object-cover object-center"
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
                  <p>{product.description}</p>
                  {!product.description ||
                  product.description === "No description available" ? (
                    <p>
                      This premium construction material is designed to meet the
                      highest industry standards and is suitable for both
                      professional and DIY construction projects. Built with
                      durability in mind, it will withstand the test of time and
                      environmental conditions.
                    </p>
                  ) : null}
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
