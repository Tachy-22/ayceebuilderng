"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface BlogCategoriesProps {
  categories: string[];
  activeCategoryName?: string;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({
  categories,
  activeCategoryName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: string) => {
    // Create a new URLSearchParams object using the current params
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      // Remove the category filter
      params.delete("category");
    } else {
      // Set the category filter
      params.set("category", category);
    }

    // Create the new URL with the updated search parameters
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        className={`px-4 py-2 cursor-pointer hover:bg-black hover:text-white transition-colors ${
          !activeCategoryName
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-800"
        }`}
        onClick={() => handleCategoryClick("All")}
      >
        All
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category}
          className={`px-4 py-2 cursor-pointer hover:bg-black hover:text-white transition-colors ${
            activeCategoryName === category
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default BlogCategories;
