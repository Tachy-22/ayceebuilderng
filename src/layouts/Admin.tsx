"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import BlogEditor from "@/components/BlogEditor";
import BlogsTable from "@/components/tables/BlogsTable";
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import formatToMonthDayYear from "@/lib/formatToMonthDayYear";

interface AdminProps {
  blogs: BlogT[];
  analytics?: {
    pageViews?: number;
    uniqueVisitors?: number;
    popularPosts?: { title: string; views: number }[];
    trafficSources?: { source: string; percentage: number }[];
    viewsByDate?: { date: string; views: number }[];
  };
}

const Admin = ({ blogs, analytics }: AdminProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate stats for blogs
  const publishedBlogs = blogs.filter((blog) => blog.isPublished).length;
  const unpublishedBlogs = blogs.length - publishedBlogs;

  // Calculate percent change for views (mock data for demonstration)
  const percentChange = 12.5; // Positive value means increase

  return (
    <div className="container mx-auto py-20 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 max-w-[600px]">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="blogs">Manage Blogs</TabsTrigger>
          <TabsTrigger value="create">Create Blog</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Page Views
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.pageViews?.toLocaleString() || 0}
                </div>
                <div className="flex items-center pt-1">
                  {percentChange > 0 ? (
                    <ChevronUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${
                      percentChange > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(percentChange)}% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.uniqueVisitors?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique visitors in the last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Blogs
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedBlogs}</div>
                <div className="text-xs text-muted-foreground">
                  From a total of {blogs.length} blogs
                </div>
                <Progress
                  value={(publishedBlogs / Math.max(blogs.length, 1)) * 100}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unpublishedBlogs}</div>
                <div className="text-xs text-muted-foreground">
                  Unpublished draft blog posts
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
                <CardDescription>
                  Top performing blog posts by page views
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.popularPosts &&
                analytics.popularPosts.length > 0 ? (
                  <ul className="space-y-4">
                    {analytics.popularPosts.map((post, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div className="flex items-start gap-2">
                          <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-gray-600">
                            {index + 1}
                          </div>
                          <span className="truncate max-w-[250px]">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {post.views.toLocaleString()} views
                          </span>
                          <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Updated {new Date().toLocaleDateString()}
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.trafficSources &&
                analytics.trafficSources.length > 0 ? (
                  <ul className="space-y-4">
                    {analytics.trafficSources.map((source, index) => (
                      <li key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {source.source}
                          </span>
                          <span className="text-sm font-medium">
                            {source.percentage}%
                          </span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No data available</p>
                )}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Updated {new Date().toLocaleDateString()}
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Page Views</CardTitle>
              <CardDescription>Page views over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.viewsByDate && analytics.viewsByDate.length > 0 ? (
                <div className="w-full mt-6">
                  <div className="flex items-end gap-2 h-64">
                    {analytics.viewsByDate.map((day, index) => {
                      const maxViews = Math.max(
                        ...analytics.viewsByDate!.map((d) => d.views)
                      );
                      const height = (day.views / maxViews) * 100;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-blue-500 rounded-t-md w-full transition-all duration-500 ease-in-out hover:bg-blue-600"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs mt-2 font-medium">
                            {formatToMonthDayYear(day.date)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {day.views}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
