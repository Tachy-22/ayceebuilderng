import React from "react";
import { fetchDocument } from "@/app/actions/fetchDocument";
import { fetchCollection } from "@/app/actions/fetchCollection";
import Blog from "@/components/Blog";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ViewCounter from "@/components/ViewCounter";
import RelatedBlogs from "@/components/RelatedBlogs";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { optimizeBlogImage } from "@/lib/imageUtils";


// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const blog = await fetchDocument<BlogT>("blogs", params.id);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Ayceebuilder",
      description: "The requested blog post could not be found.",
    };
  }

  // Use thumbnail URL if available, otherwise use the first image
  const mainImageUrl =
    blog.thumbnailUrl ||
    (blog.imageUrls && blog.imageUrls.length > 0 ? blog.imageUrls[0] : null);

  // Optimize the image for OG if it exists
  const optimizedImageUrl = mainImageUrl
    ? optimizeBlogImage(mainImageUrl, "large")
    : "/og-image.png";

  return {
    title: `${blog.title} | Ayceebuilder Blog`,
    description:
      blog.excerpt || "Read this insightful article from Ayceebuilder",
    openGraph: {
      title: blog.title,
      description:
        blog.excerpt || "Read this insightful article from Ayceebuilder",
      images: [{ url: optimizedImageUrl }],
      type: "article",
      publishedTime:
        blog.date instanceof Date
          ? blog.date.toISOString()
          : new Date(blog.date).toISOString(),
      authors: [blog.author],
    },
  };
}

const BlogPostPage = async ({ params }: { params: { id: string } }) => {
  const blog = await fetchDocument<BlogT>("blogs", params.id);

  if (!blog) {
    notFound();
  }

  // Check if the blog is published
  if (!blog.isPublished) {
    // In a real app, you could check for admin privileges here
    // For now, we'll just show a not found page for unpublished blogs
    notFound();
  }

  // Fetch related blogs in the same category
  const allBlogs = await fetchCollection<BlogT>("blogs");

  return (
    <div className="container mx-auto py-10 px-4">
      {/* ViewCounter component will handle incrementing the view count */}
      <ViewCounter blogId={params.id} />

      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to all blogs
        </Link>
        <article>
          <Blog blogData={blog} />

          {/* Display tags if available */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    key={tag}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Display view count */}
          <div className="text-sm text-gray-500 mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
            <div>
              {blog.views ? `${blog.views.toLocaleString()} views` : "0 views"}
            </div>
            <div>
              Published:{" "}
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </article>{" "}
        {/* Related blog posts */}
        <RelatedBlogs
          blogs={allBlogs}
          currentBlogId={blog.id}
          category={blog.category}
        />
        {/* Admin analytics (only visible to admin users) */}
      </div>

      {/* Analytics tracking */}
    </div>
  );
};

export default BlogPostPage;
