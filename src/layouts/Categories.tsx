"use client";
import React, { useState, useEffect } from "react";
import { categories, products, Product } from "@/data/products";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const Categories = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(id || null);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | []>([]);

  useEffect(() => {
    setIsLoaded(true);
    if (id) {
      setSelectedCategory(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/categories/${categoryId}`);
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
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.itemCount} items
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    View Products
                  </Button>
                </div>
              </div>
            ))}
          </div>

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

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, 8).map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={isLoaded ? "animate-fade-in" : "opacity-0"}
                      style={{ animationDelay: `${0.05 * index}s` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    There are no products in this category yet.
                  </p>
                  <Button onClick={() => setSelectedCategory(null)}>
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
