import React from "react";
import { fetchCollection } from "../actions/fetchCollection";
import Admin from "@/layouts/Admin";

import AdminWrapper from "./AdminWrapper";

const Page = async () => {
  // Fetch blogs from Firestore
  const blogs = await fetchCollection<BlogT>("blogs", {
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  // Get real analytics data from Firebase

  return (
    <AdminWrapper>
      <Admin blogs={blogs}/>
    </AdminWrapper>
  );
};

export default Page;
