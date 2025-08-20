"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BlogEditor from "@/components/BlogEditor";
import { fetchCollection } from "../../actions/fetchCollection";
import { deleteDocument } from "../../actions/deleteDocument";
import { toast } from "sonner";
import Image from 'next/image';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogT[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogT | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filterBlogs = useCallback(() => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog =>
        statusFilter === 'published' ? blog.isPublished : !blog.isPublished
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, statusFilter]);

  useEffect(() => {
    filterBlogs();
  }, [filterBlogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await fetchCollection<BlogT>("blogs", {
        orderBy: [{ field: "createdAt", direction: "desc" }],
      });

      const formattedBlogs: BlogT[] = blogsData.map(blog => {
        // Handle Firestore timestamp conversion
        const getDateValue = (value: any): Date => {
          if (!value) return new Date();
          if (typeof value === 'object' && value.toDate) {
            return value.toDate();
          }
          return new Date(value);
        };

        const createdAtDate = getDateValue(blog.createdAt || blog.date);
        const updatedAtDate = getDateValue(blog.updatedAt || blog.createdAt || blog.date);
        const dateValue = blog.date || blog.createdAt || new Date();

        return {
          ...blog,
          createdAt: createdAtDate,
          updatedAt: updatedAtDate,
          date: dateValue,
          description: blog.description || blog.excerpt || '',
          image: blog.image || blog.imageUrls?.[0] || '',
        };
      });

      setBlogs(formattedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup function to reset all dialog states
  const resetDialogStates = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowPreviewDialog(false);
    setSelectedBlog(null);
  };

  const handleCreateBlog = () => {
    resetDialogStates();
    setTimeout(() => {
      setShowCreateDialog(true);
    }, 10);
  };

  const handleBlogCreated = () => {
    resetDialogStates();
    fetchBlogs(); // Refresh the list
  };

  const handleBlogUpdated = () => {
    resetDialogStates();
    fetchBlogs(); // Refresh the list
  };

  const handlePreviewBlog = (blog: BlogT) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedBlog(blog);
      setShowPreviewDialog(true);
    }, 10);
  };

  const handleEditBlog = (blog: BlogT) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedBlog(blog);
      setShowEditDialog(true);
    }, 10);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteDocument("blogs", blogId, "/admin/blog");
      if ("success" in result && result.success) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        toast.success("Blog post deleted successfully");
      } else {
        toast.error("message" in result ? result.message : "Failed to delete blog post");
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error("Failed to delete blog post");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const publishedCount = blogs.filter(blog => blog.isPublished).length;
  const draftCount = blogs.length - publishedCount;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-gray-600">Published Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-sm text-gray-600">Draft Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Blog Management</CardTitle>
              <CardDescription>Create, edit, and manage your blog posts</CardDescription>
            </div>
            <Button onClick={handleCreateBlog}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts by title, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={(value: 'all' | 'published' | 'draft') => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <Card>
        <CardContent className="p-0">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first blog post to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleCreateBlog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {blog.image && (
                        <div className="flex-shrink-0 h-[4rem] w-[6rem] overflow-hidden rounded-lg">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {blog.title}
                          </h3>
                          <Badge variant={blog.isPublished ? "default" : "secondary"}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>

                        {blog.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {blog.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                          <span>By {blog.author || 'Unknown'}</span>
                          <span>•</span>
                          <span>{new Date(blog.createdAt || blog.date || new Date()).toLocaleDateString()}</span>
                          {blog.views && (
                            <>
                              <span>•</span>
                              <span>{blog.views} views</span>
                            </>
                          )}
                          {blog.category && (
                            <>
                              <span>•</span>
                              <span className="text-primary">{blog.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditBlog(blog)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePreviewBlog(blog)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => blog.id && handleDeleteBlog(blog.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Blog Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setSelectedBlog(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write and publish a new blog post for your audience
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <BlogEditor onClose={handleBlogCreated} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          setSelectedBlog(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Make changes to your blog post
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <BlogEditor
              update={true}
              blog={selectedBlog as BlogT}
              onClose={handleBlogUpdated}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Blog Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setSelectedBlog(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Blog Preview</DialogTitle>
            <DialogDescription>
              Preview how your blog post will look to readers
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedBlog && (
              <div className="prose max-w-none">
                <div className="mb-6">
                  {selectedBlog.image && (
                    <Image
                      src={selectedBlog.image}
                      alt={selectedBlog.title}
                      width={800}
                      height={256}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                      unoptimized
                    />
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={selectedBlog.isPublished ? "default" : "secondary"}>
                      {selectedBlog.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{selectedBlog.category}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedBlog.createdAt || selectedBlog.date || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedBlog.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <span>By {selectedBlog.author || 'Unknown'}</span>
                    {selectedBlog.views && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{selectedBlog.views} views</span>
                      </>
                    )}
                  </div>
                  {selectedBlog.excerpt && (
                    <p className="text-lg text-gray-700 mb-6 italic">
                      {selectedBlog.excerpt}
                    </p>
                  )}
                </div>
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}