"use client";
import React, { useState, useEffect } from "react";
import { products, categories, Product } from "@/data/products";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Product[] | []>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState("relevance");

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    setTimeout(() => setIsLoaded(true), 100);
  }, [initialQuery]);

  const performSearch = (query:string) => {
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(searchQuery);

    // Update URL
    const params = new URLSearchParams(location.search);
    params.set("q", searchQuery);
    window.history.pushState({}, "", `${pathname}?${params.toString()}`);
  };

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
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    if (!isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const filteredResults = searchResults
    .filter(
      (product) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0; // Relevance - keep original order
      }
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="bg-secondary/5 py-10">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {searchResults.length > 0 ? (
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

              {/* Search Results */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Search Results</h2>
                    <p className="text-muted-foreground">
                      {filteredResults.length} results for &quot;{searchQuery}&quot;
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <select
                      className="border rounded-md px-3 py-2 bg-background text-sm"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="relevance">Sort by: Relevance</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className={isLoaded ? "animate-fade-in" : "opacity-0"}
                      style={{ animationDelay: `${0.05 * index}s` }}
                    />
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-3">No results found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn&apos;t find any products matching &quot; {searchQuery} &quot;. Try
                using different keywords or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline">View Categories</Button>
                </Link>
              </div>
            </div>
          )}
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

export default Search;
