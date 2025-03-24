"use client";
import React, { useState, useEffect } from "react";
import {
  Filter,
  Search,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import ProductCard from "@/components/ProductCard";
import {
  categories,
  Product,
  ProductNew,
  mapNewProductsToProducts,
} from "@/data/products";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

interface ProductsPageProps {
  fetchedProducts: ProductNew[];
  apiUrl?: string;
  currentPage?: number;
  limit?: number;
  sheet?: string;
  search?: string;
  hasMore?: boolean;
  totalItems?: number; // New prop for total number of products
  totalPages?: number; // New prop for total number of pages
}

const ProductsPage = ({
  fetchedProducts = [],
  apiUrl = "",
  currentPage = 1,
  limit = 12,
  sheet = "all",
  search = "",
  hasMore = false,
  totalItems = 0, // Default to 0 if not provided
  totalPages = 1, // Default to 1 if not provided
}: ProductsPageProps) => {
  console.log({ fetchedProducts });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(search);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [mappedProducts, setMappedProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInput, setPageInput] = useState<string>(currentPage.toString());

  // Use the totalPages from API instead of calculating it
  const [displayedTotalPages, setDisplayedTotalPages] = useState<number>(
    totalPages || 1
  );

  // New state for tracking actions that require loading skeletons
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Listen for route changes to update action loading state
  useEffect(() => {
    // When the component mounts, we're not in a loading state
    setActionLoading(false);

    // Create a function to handle route change complete
    const handleRouteChangeComplete = () => {
      setActionLoading(false);
    };

    // Add event listener
    window.addEventListener("popstate", handleRouteChangeComplete);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handleRouteChangeComplete);
    };
  }, []);

  // Function to create URL with updated parameters
  const createQueryString = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update all provided parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    return newParams.toString();
  };

  // Initialize state from URL parameters and handle data arrival
  useEffect(() => {
    // Set search query from URL
    setSearchQuery(search);

    // Set selected category from sheet parameter
    if (sheet && sheet !== "all") {
      setSelectedCategories([sheet]);
    } else {
      setSelectedCategories([]);
    }

    // Update page input when current page changes
    setPageInput(currentPage.toString());

    // Use totalPages from API response
    if (totalPages) {
      setDisplayedTotalPages(totalPages);
    }

    // Data has arrived, turn off loading states
    setActionLoading(false);
    setIsLoadingMore(false);
  }, [search, sheet, currentPage, hasMore, fetchedProducts, totalPages]);

  // Map fetched products to the Product format
  useEffect(() => {
    const mapped = mapNewProductsToProducts(fetchedProducts);
    console.log({ mapped });
    setMappedProducts(mapped);
    setFilteredProducts(mapped);
    setIsLoaded(true);
  }, [fetchedProducts]);

  // Apply client-side filtering for price range and sorting
  useEffect(() => {
    let result = [...mappedProducts];

    // Apply price filter (client-side only)
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting (client-side)
    switch (sortOption) {
      case "newest":
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
        break;
    }

    setFilteredProducts(result);
  }, [mappedProducts, priceRange, sortOption]);

  // Handler for search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Submit search query to update URL and trigger server fetch
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set loading state
    setActionLoading(true);

    // Update URL with search parameter and reset to page 1
    router.push(
      `${pathname}?${createQueryString({
        search: searchQuery,
        page: "1",
      })}`
    );
  };

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    // Set loading state
    setActionLoading(true);

    // If this category is already selected, remove the filter (set to "all")
    // Otherwise, set the sheet parameter to this category
    const newSheet = selectedCategories.includes(categoryId)
      ? "all"
      : categoryId;

    // Update selected categories for UI
    setSelectedCategories(newSheet === "all" ? [] : [categoryId]);

    // Update URL to fetch products for this category
    router.push(
      `${pathname}?${createQueryString({
        sheet: newSheet,
        page: "1", // Reset to first page when changing category
      })}`
    );
  };

  // Handle loading more products
  const loadMoreProducts = () => {
    setIsLoadingMore(true);

    // Navigate to the next page by updating the URL
    const nextPage = (currentPage + 1).toString();
    router.push(`${pathname}?${createQueryString({ page: nextPage })}`);
  };

  // Clear all filters
  const clearFilters = () => {
    // Set loading state
    setActionLoading(true);

    setPriceRange([0, 50000]);

    // Reset URL parameters and fetch all products
    router.push(
      `${pathname}?${createQueryString({
        sheet: "all",
        search: "",
        page: "1",
      })}`
    );
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    document.body.style.overflow = !isMobileFilterOpen ? "hidden" : "auto";
  };

  // Handle navigation to specific page
  const goToPage = (page: number) => {
    if (page < 1 || page > displayedTotalPages) return;

    // Set loading state
    setActionLoading(true);

    router.push(`${pathname}?${createQueryString({ page: page.toString() })}`);
  };

  // Handle page input change and navigation
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(pageInput, 10);
    if (newPage && newPage > 0 && newPage <= displayedTotalPages) {
      // Set loading state
      setActionLoading(true);
      goToPage(newPage);
    } else {
      // Reset to current page if invalid input
      setPageInput(currentPage.toString());
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(
      displayedTotalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Add ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => goToPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis and last page if needed
    if (endPage < displayedTotalPages) {
      if (endPage < displayedTotalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={`page-${displayedTotalPages}`}>
          <PaginationLink
            isActive={currentPage === displayedTotalPages}
            onClick={() => goToPage(displayedTotalPages)}
          >
            {displayedTotalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Product Skeleton Grid for loading state
  const ProductSkeletonGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col rounded-lg overflow-hidden border border-gray-200"
          >
            {/* Image skeleton */}
            <Skeleton className="w-full h-60" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />

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
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full">
      <main className="flex-grow pt-20">
        {/* Page Header */}
        <div className="bg-secondary/5 py-10">
          <div className=" mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Building Materials</h1>
                <p className="text-muted-foreground">
                  {actionLoading
                    ? "Loading..."
                    : `${
                        totalItems || filteredProducts.length
                      } products available`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex gap-2 w-full sm:w-auto"
                >
                  <div className="relative flex-1">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full pl-9"
                      disabled={actionLoading}
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </form>

                <div className="flex gap-3">
                  <Select
                    value={sortOption}
                    onValueChange={setSortOption}
                    disabled={actionLoading}
                  >
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
                    disabled={actionLoading}
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
                        onClick={() => toggleCategory(selectedCategories[0])}
                        disabled={actionLoading}
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
                          disabled={actionLoading}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className={`text-sm cursor-pointer ${
                            actionLoading ? "opacity-50" : ""
                          }`}
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
                      disabled={actionLoading}
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
                    disabled={actionLoading}
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
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              {actionLoading ? (
                // Show skeleton when loading
                <ProductSkeletonGrid />
              ) : filteredProducts.length == 0 ? (
                // Show "No products found" message

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
                // Show actual products
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={`${product.id}-${currentPage}-${index}`}
                        product={product}
                        className={isLoaded ? "animate-fade-in" : "opacity-0"}
                        style={{ animationDelay: `${0.05 * index}s` }}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-12 space-y-6">
                    {/* Modern pagination UI */}
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              currentPage > 1 && goToPage(currentPage - 1)
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                            isActive={actionLoading || currentPage === 1}
                          />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              currentPage < displayedTotalPages &&
                              goToPage(currentPage + 1)
                            }
                            className={
                              currentPage >= displayedTotalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                            isActive={
                              actionLoading ||
                              currentPage >= displayedTotalPages
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    {/* Current page indicator - now shows accurate totals */}
                    <div className="text-sm text-center text-muted-foreground">
                      Page {currentPage} of {displayedTotalPages} • Total of {totalItems}{" "}
                      products
                    </div>
                  </div>
                </>
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
            {/* Mobile filter drawer header */}
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

            {/* Mobile filter content */}
            <div className="p-6 space-y-6">
              {/* Mobile categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Categories</h3>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-sm"
                      onClick={() => toggleCategory(selectedCategories[0])}
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

              {/* Mobile price range */}
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

            {/* Mobile filter footer */}
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
    </div>
  );
};

export default ProductsPage;
