"use client";
import React, { useState, useEffect } from "react";
import { categories, Product, ProductNew, mapNewProductsToProducts } from "@/data/products";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  apiUrl: string;
  fetchedProducts: ProductNew[];
  selectedCategory: string | null;
  currentPage?: number;
  limit?: number;
  hasMore?: boolean;
}

const Categories = ({ 
  apiUrl,
  fetchedProducts = [], 
  selectedCategory = null,
  currentPage = 1,
  limit = 8,
  hasMore = false
}: CategoriesProps) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mappedProducts, setMappedProducts] = useState<Product[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Convert fetched products to the Product format
  useEffect(() => {
    // Map products data when it's received
    const mapped = mapNewProductsToProducts(fetchedProducts);
    setMappedProducts(mapped);
    
    // Turn off loading states since data has arrived
    setIsLoaded(true);
    setActionLoading(false);
  }, [fetchedProducts]);

  // Listen for route changes to update loading state
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setActionLoading(false);
    };
    
    window.addEventListener("popstate", handleRouteChangeComplete);
    return () => {
      window.removeEventListener("popstate", handleRouteChangeComplete);
    };
  }, []);

  // Handle category selection with URL updates
  const handleSelectCategory = (categoryId: string) => {
    // If already selected, deselect
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    
    // Show loading state
    setActionLoading(true);
    
    // Update URL with query parameters
    if (newCategory) {
      router.push(`/categories?category=${newCategory}&page=1&limit=${limit}`);
    } else {
      router.push('/categories');
    }
  };

  // Handle loading more products
  const loadMoreProducts = () => {
    if (!selectedCategory) return;
    
    // Show loading state
    setActionLoading(true);
    
    // Update URL with next page
    const nextPage = currentPage + 1;
    router.push(`/categories?category=${selectedCategory}&page=${nextPage}&limit=${limit}`);
  };

  // Skeleton loader for category products
  const ProductSkeletonGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col rounded-lg overflow-hidden border border-gray-200">
            {/* Image skeleton */}
            <Skeleton className="w-full h-48" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="pt-3">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">
              Browse our wide range of construction materials
            </p>
          
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all ${
                  category.id === selectedCategory
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                onClick={() => handleSelectCategory(category.id)}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/30 p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                  {/* <p className="text-sm text-muted-foreground mt-1">
                    {category.itemCount} items
                  </p> */}
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="translate-y-4 group-hover:translate-y-0 transition-transform"
                    disabled={actionLoading}
                  >
                    {actionLoading && category.id === selectedCategory ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    View Products
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Products Section */}
          {selectedCategory && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                  Products
                </h2>
                <Link href={`/products?category=${selectedCategory}`}>
                  <Button variant="ghost" className="gap-1">
                    View All
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              {actionLoading ? (
                <ProductSkeletonGrid />
              ) : mappedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mappedProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        className={isLoaded ? "animate-fade-in" : "opacity-0"}
                        style={{ animationDelay: `${0.05 * index}s` }}
                      />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <Button 
                        onClick={loadMoreProducts}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More Products"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    There are no products in this category yet.
                  </p>
                  <Button onClick={() => handleSelectCategory(selectedCategory)}>
                    Browse All Categories
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;
