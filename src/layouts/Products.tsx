"use client"
import React, { useState, useEffect } from "react";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const ProductsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const location = useSearchParams();

  useEffect(() => {
    setIsLoaded(true);

    // Check if we have a category param in the URL

    const categoryParam = location.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location]);

  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // This would normally sort by date, but we don't have a date field
        // So we'll just reverse the array as a placeholder
        result = [...result].reverse();
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured is default, no special sort
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategories, priceRange, sortOption, searchQuery]);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50000]);
    setSearchQuery("");
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    if (!isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Page Header */}
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Construction Materials
                </h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} products available
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-9"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    className="md:hidden"
                    onClick={toggleMobileFilter}
                  >
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Categories</h3>
                    {selectedCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-sm"
                        onClick={() => setSelectedCategories([])}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Price Range</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-sm"
                      onClick={() => setPriceRange([0, 50000])}
                    >
                      Reset
                    </Button>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={50000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      ₦{priceRange[0].toLocaleString()}
                    </span>
                    <span className="text-sm">
                      ₦{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={isLoaded ? "animate-fade-in" : "opacity-0"}
                      style={{ animationDelay: `${0.05 * index}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={toggleMobileFilter}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white animate-slide-in overflow-auto">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileFilter}
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Categories</h3>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-sm"
                      onClick={() => setSelectedCategories([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`mobile-category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <label
                        htmlFor={`mobile-category-${category.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Price Range</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-sm"
                    onClick={() => setPriceRange([0, 50000])}
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={50000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    ₦{priceRange[0].toLocaleString()}
                  </span>
                  <span className="text-sm">
                    ₦{priceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t sticky bottom-0 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button onClick={toggleMobileFilter}>Apply Filters</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsPage;
