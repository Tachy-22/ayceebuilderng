import React from "react";
import { fetchCollection } from "../actions/fetchCollection";
import Admin from "@/layouts/Admin";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getFirestore,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminWrapper from "./AdminWrapper";

const Page = async () => {
  // Fetch blogs from Firestore
  const blogs = await fetchCollection<BlogT>("blogs", {
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  // Initialize analytics data
  let analyticsData = {
    pageViews: 0,
    uniqueVisitors: 0,
    popularPosts: [] as { title: string; views: number }[],
    trafficSources: [
      { source: "Direct", percentage: 35 },
      { source: "Organic Search", percentage: 28 },
      { source: "Social Media", percentage: 22 },
      { source: "Referrals", percentage: 15 },
    ],
    viewsByDate: [] as { date: string; views: number }[],
  };

  try {
    // Calculate total page views
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    analyticsData.pageViews = totalViews;

    // Get popular posts (blogs with most views)
    const popularPosts = [...blogs]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((blog) => ({
        title: blog.title,
        views: blog.views || 0,
      }));

    analyticsData.popularPosts = popularPosts;

    // Get unique visitors (just an estimate based on 40% of total views)
    analyticsData.uniqueVisitors = Math.round(totalViews * 0.4);

    // Generate views by date for the last 7 days
    const now = new Date();
    const viewsByDate = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      // Simulate views data (in a real app, you would fetch this from Firebase Analytics)
      const views = Math.floor(Math.random() * 100) + 300; // Random views between 300-400

      viewsByDate.push({
        date: dateString,
        views,
      });
    }    analyticsData.viewsByDate = viewsByDate;
  } catch (error) {
    console.error("Error calculating analytics:", error);
  }

  return (
    <AdminWrapper>
      <Admin blogs={blogs} analytics={analyticsData} />
    </AdminWrapper>
  );
};

export default Page;
