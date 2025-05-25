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
import { getAnalyticsData } from "@/lib/analytics";

const Page = async () => {
  // Fetch blogs from Firestore
  const blogs = await fetchCollection<BlogT>("blogs", {
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  // Get real analytics data from Firebase
  const analyticsData = await getAnalyticsData(7); // Get data for the last 7 days

  return (
    <AdminWrapper>
      <Admin blogs={blogs} analytics={analyticsData} />
    </AdminWrapper>
  );
};

export default Page;
