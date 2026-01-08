import React from "react";
import { fetchCollection } from "../actions/fetchCollection";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import BlogCategories from "@/components/BlogCategories";
import BlogSearch from "@/components/BlogSearch";
import { ArrowRight, Eye } from "lucide-react";
import { optimizeBlogImage } from "@/lib/imageUtils";
import formatToMonthDayYear from "@/lib/formatToMonthDayYear";

export const metadata: Metadata = {
  title: "Blog | Ayceebuilder",
  description:
    "Read the latest articles and insights about construction, home building, and interior design.",
  openGraph: {
    title: "Blog | Ayceebuilder",
    description:
      "Read the latest articles and insights about construction, home building, and interior design.",
    images: ["/og-image.png"],
  },
};

const BlogPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // Get category filter and search query from URL
  const categoryFilter =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const searchQuery =
    typeof searchParams.q === "string" ? searchParams.q : undefined;

  // Fetch all blogs with optional category filter
  const fetchOptions: any = {
    orderBy: [{ field: "date", direction: "desc" }],
    filters: [
      {
        field: "isPublished",
        operator: "==",
        value: true,
      },
    ],
  };
  // Only show published blogs
  // fetchOptions.filters = [
  //   {
  //     field: "isPublished",
  //     operator: "==",
  //     value: true,
  //   },
  // ];

  // // Add category filter if provided
  if (categoryFilter) {
    fetchOptions.filters.push({
      field: "category",
      operator: "==",
      value: categoryFilter,
    });
  }

  // Fetch blogs based on the filters
  const blogs = await fetchCollection<BlogT>("blogs", fetchOptions);

  // Filter blogs by search query if provided
  const filteredBlogs = searchQuery
    ? blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
    )
    : blogs; // Extract unique categories from all published blogs for the

 // console.log({ filteredBlogs, blogs });
  const allBlogs = await fetchCollection<BlogT>("blogs", {
    filters: [{ field: "isPublished", operator: "==", value: true }],
  });

  const categories = Array.from(new Set(allBlogs.map((blog) => blog.category)));

  return (
    <div className=" mx-auto py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Blog</h1>
        <p className="text-muted-foreground mb-8">
          Latest articles, insights and updates from Ayceebuilder
        </p>
        {/* Search bar */}
        <BlogSearch />
        {/* Category filter */}
        <BlogCategories
          categories={categories}
          activeCategoryName={categoryFilter}
        />
        {/* Display search information if searching */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">
              {filteredBlogs.length === 0
                ? `No results found for "${searchQuery}"`
                : `Found ${filteredBlogs.length} ${filteredBlogs.length === 1 ? "result" : "results"
                } for "${searchQuery}"`}
            </p>
            {filteredBlogs.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search terms or browse by category instead.
              </p>
            )}
          </div>
        )}
        {filteredBlogs.length === 0 && !searchQuery ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-2">No blog posts found</h2>
            <p className="text-muted-foreground mb-4">
              {categoryFilter
                ? `There are no posts in the "${categoryFilter}" category yet.`
                : "Check back soon for new content!"}
            </p>
            {categoryFilter && (
              <Link href="/blog" className="text-primary hover:underline">
                View all posts
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Featured blog (first item) - only show if not searching */}
            {filteredBlogs.length > 0 && !searchQuery && (
              <div className="mb-12">
                <Link
                  href={`/blog/${filteredBlogs[0].id}`}
                  className="group block rounded-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {" "}
                    <div className="relative h-72 md:h-full w-full bg-gray-100">
                      <img
                        src={filteredBlogs[0].imageUrls?.[0]}
                        alt={filteredBlogs[0].title}
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium rounded">
                        Featured
                      </div>
                    </div>
                    <div className="p-6 flex flex-col">
                      <div className="text-sm text-primary font-medium mb-2">
                        {filteredBlogs[0].category}
                      </div>
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {filteredBlogs[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {filteredBlogs[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm text-muted-foreground">
                          {formatToMonthDayYear(
                            filteredBlogs[0].date as string
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="h-4 w-4 mr-1" />
                            {filteredBlogs[0].views || 0}
                          </div>
                          <div className="text-sm font-medium">
                            {filteredBlogs[0].author}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        Read article <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
            {/* Blog grid (skip the first one if featured and not searching) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery ? filteredBlogs : filteredBlogs.slice(1)).map(
                (blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="group flex flex-col h-full border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {" "}
                    <div className="relative h-48 overflow-hidden w-full bg-gray-100">
                      <img
                        src={blog.thumbnailUrl}
                        alt={blog.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="text-sm text-primary font-medium mb-2">
                        {blog.category}
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {formatToMonthDayYear(blog.date as string)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Eye className="h-3 w-3 mr-1" /> {blog.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>{" "}
          </>
        )}{" "}
      </div>
    </div>
  );
};

export default BlogPage;
