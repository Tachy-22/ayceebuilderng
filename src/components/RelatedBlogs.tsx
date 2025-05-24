"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedBlogsProps {
  blogs: BlogT[];
  currentBlogId?: string;
  category?: string;
  limit?: number;
}

const RelatedBlogs: React.FC<RelatedBlogsProps> = ({
  blogs,
  currentBlogId,
  category,
  limit = 3,
}) => {
  // Filter blogs: same category, different ID, and only published blogs
  const relatedBlogs = blogs
    .filter(
      (blog) =>
        blog.isPublished &&
        blog.id !== currentBlogId &&
        (category ? blog.category === category : true)
    )
    .slice(0, limit);

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
        <div className="space-y-4">
          {relatedBlogs.map((blog) => (
            <div key={blog.id} className="border-b pb-4 last:border-0">
              <Link href={`/blog/${blog.id}`} className="group">
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center text-sm text-primary mt-2 group-hover:underline">
                  Read more <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedBlogs;
