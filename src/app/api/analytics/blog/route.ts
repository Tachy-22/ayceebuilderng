import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    const days = parseInt(searchParams.get("days") || "7", 10);

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Query page views for this blog
    const pageViewsRef = collection(db, "pageViews");
    const pageViewsQuery = query(
      pageViewsRef,
      where("blogId", "==", blogId),
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );

    const pageViewsSnapshot = await getDocs(pageViewsQuery);

    // Aggregate data
    const viewsByDate: Record<string, number> = {};
    const uniqueVisitors = new Set();
    let totalViews = 0;

    pageViewsSnapshot.forEach((doc) => {
      const data = doc.data();

      // Count views by date
      const date =
        data.date ||
        data.timestamp?.toDate().toISOString().split("T")[0] ||
        formatDate(new Date());
      viewsByDate[date] = (viewsByDate[date] || 0) + 1;

      // Count unique visitors
      if (data.visitorId) {
        uniqueVisitors.add(data.visitorId);
      }

      totalViews++;
    });

    // Format data for response
    const viewsByDateArray = Object.entries(viewsByDate)
      .map(([date, views]) => ({
        date,
        views,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get referrer data
    const referrerTypes = {
      direct: 0,
      organic: 0,
      social: 0,
      referral: 0,
    };

    const referrersQuery = query(
      collection(db, "referrers"),
      where("blogId", "==", blogId),
      where("timestamp", ">=", Timestamp.fromDate(startDate))
    );

    const referrersSnapshot = await getDocs(referrersQuery);

    referrersSnapshot.forEach((doc) => {
      const data = doc.data();
      const type = data.referrerType || "referral";
      if (type in referrerTypes) {
        referrerTypes[type as keyof typeof referrerTypes]++;
      }
    });

    // Calculate percentages
    const totalReferrers = Object.values(referrerTypes).reduce(
      (sum, count) => sum + count,
      0
    );
    const trafficSources = [
      {
        source: "Direct",
        percentage: totalReferrers
          ? Math.round((referrerTypes.direct / totalReferrers) * 100)
          : 25,
      },
      {
        source: "Organic Search",
        percentage: totalReferrers
          ? Math.round((referrerTypes.organic / totalReferrers) * 100)
          : 25,
      },
      {
        source: "Social Media",
        percentage: totalReferrers
          ? Math.round((referrerTypes.social / totalReferrers) * 100)
          : 25,
      },
      {
        source: "Referrals",
        percentage: totalReferrers
          ? Math.round((referrerTypes.referral / totalReferrers) * 100)
          : 25,
      },
    ];

    return NextResponse.json({
      totalViews,
      uniqueVisitors: uniqueVisitors.size,
      viewsByDate: viewsByDateArray,
      trafficSources,
    });
  } catch (error) {
    console.error("Error fetching blog analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
