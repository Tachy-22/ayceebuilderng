"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import JEditor from "./JoditEditor";
import Blog from "./Blog";
import { Button } from "./ui/button";
import { FileInput } from "./FileInput";
import SubmitButton from "./ui/SubmitButton";
import { updateDocument } from "@/app/actions/updateDocument";
import { addDocument } from "@/app/actions/addDocument";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import Image from "next/image";

interface BlogEditorProps {
  update?: boolean;
  blog?: BlogT;
  onClose?: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  update = false,
  blog,
  onClose,
}) => {
  const router = useRouter();
  const path = usePathname();

  const defaultBlogData: BlogT = {
    title: "",
    author: "",
    date: new Date().toISOString(),
    content: "",
    category: "Uncategorized",
    imageUrls: [],
    excerpt: "",
    tags: [],
    isPublished: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const [blogData, setBlogData] = useState<BlogT>(
    update && blog ? { ...blog } : defaultBlogData
  );
  const [isFormOpen, setIsFormOpen] = useState(true); // Always open when used in dialogs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    update && blog ? blog.thumbnailUrl : undefined
  );
  const handleUploadComplete = (files: FileMetadata[]) => {
    // Get Cloudinary URLs from uploaded files
    const urls = files.map((file) => file.url);

    console.log("Uploaded files:", files);
    console.log("Image URLs:", urls);

    // Update the blog data with the new image URLs
    setBlogData((prev) => ({
      ...prev,
      imageUrls: urls,
      // If the blog has no thumbnail set, use the first image
      thumbnailUrl:
        prev.thumbnailUrl ||
        thumbnailUrl ||
        (urls.length > 0 ? urls[0] : undefined),
    }));

    // If we have a new image and no thumbnail set, use the first image as thumbnail
    if (urls.length > 0 && !thumbnailUrl) {
      setThumbnailUrl(urls[0]);
    }

    // Clear any errors related to images
    if (errors.imageUrls) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.imageUrls;
        return newErrors;
      });
    }

    console.log("Images uploaded successfully:", urls);
    console.log(
      "Current thumbnail URL:",
      thumbnailUrl || urls[0] || "None set"
    );
  };

  useEffect(() => {
    if (update && blog) {
      setBlogData(blog as BlogT);
      setIsFormOpen(true);
    }
  }, [update, blog]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!blogData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!blogData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!blogData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!blogData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }

    if (blogData.imageUrls.length === 0) {
      newErrors.imageUrls = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setBlogData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleJEditorChange = (contentString: string) => {
    setBlogData((prev) => ({ ...prev, content: contentString }));

    // Clear content error if it exists
    if (errors.content) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!blogData.tags?.includes(newTag)) {
        setBlogData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      // Update timestamps
      const updatedBlogData = {
        ...blogData,
        updatedAt: new Date().toISOString(),
        createdAt: blogData.createdAt || new Date().toISOString(),
      };

      if (update && blog) {
        const result = await updateDocument(
          "blogs",
          blog?.id as string,
          updatedBlogData,
          path
        );
        if ("success" in result && result.success) {
          toast.success("Blog post updated successfully");
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to update blog post"
          );
        }
      } else {
        const result = await addDocument("blogs", updatedBlogData, path);
        if ("success" in result && result.success) {
          toast.success("Blog post created successfully");
          setBlogData(defaultBlogData);
          onClose?.();
          router.refresh();
        } else {
          toast.error(
            "message" in result ? result.message : "Failed to create blog post"
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isFormOpen && (
        <form className="flex flex-col gap-6 h-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Blog Form */}
            <div className="bg-gray-50 rounded-lg p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Blog Details</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={blogData.title}
                    onChange={handleChange}
                    className={`w-full border ${errors.title ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="author"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={blogData.author}
                    onChange={handleChange}
                    className={`w-full border ${errors.author ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="excerpt"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={blogData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full border ${errors.excerpt ? "border-red-500" : "border-gray-300"
                      } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter brief excerpt"
                  />
                  {errors.excerpt && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.excerpt}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={blogData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Construction Tips">Construction Tips</option>
                    <option value="Home Improvement">Home Improvement</option>
                    <option value="Product Highlights">
                      Product Highlights
                    </option>
                    <option value="Sustainable Building">
                      Sustainable Building
                    </option>
                    <option value="Innovation & Trends">
                      Innovation & Trends
                    </option>
                    <option value="Customer Stories">Customer Stories</option>
                    <option value="Partnerships & Projects">
                      Partnerships & Projects
                    </option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="isPublished"
                    checked={blogData.isPublished}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("isPublished", checked === true)
                    }
                  />
                  <Label htmlFor="isPublished">Publish immediately</Label>
                </div>{" "}
                <div className="col-span-1 md:col-span-2 gap-3 flex flex-col py-[1rem]">
                  <div className="pb-3 text-gray-900">
                    Add Display Image <span className="text-red-500">*</span>
                  </div>
                  <FileInput
                    multiple={true}
                    accept="image/*"
                    maxFileSize={10}
                    onUploadComplete={handleUploadComplete}
                    initialFiles={blogData?.imageUrls || []}
                  />
                  {errors.imageUrls && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.imageUrls}
                    </p>
                  )}
                </div>
                {/* Thumbnail Selection */}
                {blogData.imageUrls && blogData.imageUrls.length > 0 && (
                  <div className="col-span-1 md:col-span-2 gap-3 flex flex-col py-[1rem]">
                    <div className="pb-3 text-gray-900">
                      Select Thumbnail Image
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {blogData.imageUrls.map((imageUrl, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setThumbnailUrl(imageUrl);
                            setBlogData((prev) => ({
                              ...prev,
                              thumbnailUrl: imageUrl,
                            }));
                          }}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 h-24 ${(blogData.thumbnailUrl || thumbnailUrl) === imageUrl
                              ? "border-blue-500 ring-2 ring-blue-300"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Blog image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                            unoptimized // Important for Cloudinary images to work correctly
                          />
                          {(blogData.thumbnailUrl || thumbnailUrl) ===
                            imageUrl && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  Thumbnail
                                </span>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blogData.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      <TagIcon className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-4 mt-4 flex-1">
                <label className="block font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                {typeof window !== "undefined" && (
                  <JEditor
                    value={blogData.content}
                    placeholder="Write your blog content here..."
                    onChange={handleJEditorChange}
                  />
                )}
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Blog Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Preview
                </h3>
              </div>
              <div className="p-4">
                <Blog blogData={blogData} />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <SubmitButton
              disabled={isSubmitting}
              loadingtext="Saving..."
              className="flex-1 bg-primary text-white py-3 rounded font-medium hover:bg-primary/90 transition"
            >
              {update ? "Update Blog Post" : "Create Blog Post"}
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogEditor;
