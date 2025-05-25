import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EcommerceEventType } from "@/lib/analytics/trackEcommerceEvent";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const days = parseInt(url.searchParams.get("days") || "30");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Calculate date range (last n days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Query e-commerce events collection
    const eventsRef = collection(db, "ecommerce_events");

    // Get all events for this product
    const eventsQuery = query(
      eventsRef,
      where("products", "array-contains", { id: productId }),
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );

    const eventsSnapshot = await getDocs(eventsQuery);

    // Extract events by type
    const events = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      eventType: EcommerceEventType;
      visitorId?: string;
      referrer?: string;
      timestamp?: Timestamp;
      date?: string;
    }>;

    // Count events by type
    const viewEvents = events.filter(
      (event) => event.eventType === EcommerceEventType.VIEW_ITEM
    );
    const addToCartEvents = events.filter(
      (event) => event.eventType === EcommerceEventType.ADD_TO_CART
    );
    const purchaseEvents = events.filter(
      (event) => event.eventType === EcommerceEventType.PURCHASE
    );
    const wishlistEvents = events.filter(
      (event) => event.eventType === EcommerceEventType.ADD_TO_WISHLIST
    );

    // Get unique visitors
    const uniqueVisitors = new Set();
    viewEvents.forEach((event) => {
      if (event.visitorId) {
        uniqueVisitors.add(event.visitorId);
      }
    });

    // Calculate conversion rate
    const conversionRate =
      viewEvents.length > 0
        ? (purchaseEvents.length / viewEvents.length) * 100
        : 0;

    // Get referrer data
    const trafficSources = [
      { source: "Direct", percentage: 0 },
      { source: "Organic Search", percentage: 0 },
      { source: "Social Media", percentage: 0 },
      { source: "Referrals", percentage: 0 },
    ];

    // If there are view events, analyze traffic sources
    if (viewEvents.length > 0) {
      const sources = {
        direct: 0,
        organic: 0,
        social: 0,
        referral: 0,
        total: 0,
      };

      viewEvents.forEach((event) => {
        sources.total++;
        const referrer = event.referrer || "";

        if (!referrer) {
          sources.direct++;
        } else if (referrer.includes("google") || referrer.includes("bing")) {
          sources.organic++;
        } else if (
          referrer.includes("facebook") ||
          referrer.includes("twitter") ||
          referrer.includes("instagram") ||
          referrer.includes("linkedin")
        ) {
          sources.social++;
        } else {
          sources.referral++;
        }
      });

      // Calculate percentages
      if (sources.total > 0) {
        trafficSources[0].percentage = Math.round(
          (sources.direct / sources.total) * 100
        );
        trafficSources[1].percentage = Math.round(
          (sources.organic / sources.total) * 100
        );
        trafficSources[2].percentage = Math.round(
          (sources.social / sources.total) * 100
        );
        trafficSources[3].percentage = Math.round(
          (sources.referral / sources.total) * 100
        );
      }
    }

    // Group events by date
interface EventDateData {
  date: string;
  views: number;
  addToCarts: number;
  purchases: number;
}

const eventsByDate: EventDateData[] = [];

    // Create a map for quick lookup
    const dateMap = new Map();

    // Process all dates in the range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      dateMap.set(dateStr, {
        date: dateStr,
        views: 0,
        addToCarts: 0,
        purchases: 0,
      });
    }

    // Count views by date
    viewEvents.forEach((event) => {
      const date =
        event.date || event.timestamp?.toDate().toISOString().split("T")[0];
      if (date && dateMap.has(date)) {
        const entry = dateMap.get(date);
        entry.views++;
        dateMap.set(date, entry);
      }
    });

    // Count add to cart events by date
    addToCartEvents.forEach((event) => {
      const date =
        event.date || event.timestamp?.toDate().toISOString().split("T")[0];
      if (date && dateMap.has(date)) {
        const entry = dateMap.get(date);
        entry.addToCarts++;
        dateMap.set(date, entry);
      }
    });

    // Count purchase events by date
    purchaseEvents.forEach((event) => {
      const date =
        event.date || event.timestamp?.toDate().toISOString().split("T")[0];
      if (date && dateMap.has(date)) {
        const entry = dateMap.get(date);
        entry.purchases++;
        dateMap.set(date, entry);
      }
    });

    // Convert map to array and sort by date
    dateMap.forEach((value) => {
      eventsByDate.push(value);
    });

    eventsByDate.sort((a, b) => a.date.localeCompare(b.date));

    // Compile final analytics data
    const analyticsData = {
      totalViews: viewEvents.length,
      uniqueVisitors: uniqueVisitors.size,
      addToCartCount: addToCartEvents.length,
      purchaseCount: purchaseEvents.length,
      conversionRate,
      addToWishlistCount: wishlistEvents.length,
      eventsByDate,
      trafficSources,
    };

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}
