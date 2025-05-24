"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Replace with your table component path
import React from "react";

import { AlertCircle } from "lucide-react";
import { useTableOperations } from "@/hooks/useTableOperations";
import { EditModal } from "../modals/EditModal";
import BlogEditor from "../BlogEditor";
import { DeleteConfirmationModal } from "../modals/DeleteConfirmationModal";
import formatToMonthDayYear from "@/lib/formatToMonthDayYear";
import { PaginationControls, SearchControls } from "../TableControls";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";


const BlogsTable = ({ blogs }: { blogs: BlogT[] }) => {
  const {
    paginatedData: displayedBlogs,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize,
    setPageSize,
  } = useTableOperations({
    data: blogs,
    searchFields: ["title", "author", "category"],
    itemsPerPage: 10,
  });

  const success = Array.isArray(blogs) || "items" in blogs;
  const error = !success ? "Failed to load blogs" : null;
  const loading = !success && !error;
  const slideIn = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  if (error) {
    return (
      <motion.div {...slideIn}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div {...slideIn}>
        <Card className="min-w-full mx-auto !bg-white border-0">
          <CardContent className="flex justify-center p-4">
            Loading...
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={slideIn.initial}
      animate={slideIn.animate}
      transition={slideIn.transition}
    >
      <Card className="min-w-full mx-auto bg-white text-black border border-black/20">
        <CardHeader>
          <CardTitle className="text-black">All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <Table>
            <TableHeader>
              <TableRow className="border-black/20">
                <TableHead className="text-black font-bold">Title</TableHead>
                <TableHead className="text-black font-bold">Author</TableHead>
                <TableHead className="text-black font-bold">Date</TableHead>
                <TableHead className="text-black font-bold">Category</TableHead>
                <TableHead className="text-black font-bold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedBlogs.length === 0 ? (
                <TableRow className="border-black/20">
                  <TableCell colSpan={5} className="text-center text-black">
                    No blogs found
                  </TableCell>
                </TableRow>
              ) : (
                displayedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{formatToMonthDayYear(blog.date as string)}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditModal title="Edit Blog">
                          <BlogEditor blog={blog} update />
                          {/* <div>hi</div> */}
                        </EditModal>
                        <DeleteConfirmationModal
                          id={blog.id as string}
                          collection="blogs"
                          name="blog"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogsTable;
