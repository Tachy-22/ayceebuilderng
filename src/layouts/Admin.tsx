"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BlogEditor from "@/components/BlogEditor";
import BlogsTable from "@/components/tables/BlogsTable";


interface AdminProps {
  blogs: BlogT[];

}

const Admin = ({ blogs }: AdminProps) => {
  const [activeTab, setActiveTab] = useState("blogs");

  // Calculate stats for blogs
  const publishedBlogs = blogs.filter((blog) => blog.isPublished).length;
  const unpublishedBlogs = blogs.length - publishedBlogs;

  // Calculate percent change for views (mock data for demonstration)

  return (
    <div className="container mx-auto py-20 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs
        defaultValue="blogs"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 max-w-[400px]">
          <TabsTrigger value="blogs">Manage Blogs</TabsTrigger>
          <TabsTrigger value="create">Create Blog</TabsTrigger>{" "}
        </TabsList>

        <TabsContent value="blogs">
          <BlogsTable blogs={blogs} />
        </TabsContent>

        <TabsContent value="create">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-6">Create New Blog Post</h2>
            <BlogEditor />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
