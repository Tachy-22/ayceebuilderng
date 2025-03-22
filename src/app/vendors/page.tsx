import Vendors from "@/layouts/Vendors";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendors",
  description: "Browse trusted vendors of construction materials in Nigeria. Find quality suppliers for your building projects.",
  keywords: ["construction vendors", "building materials suppliers", "nigeria contractors"],
  openGraph: {
    title: "Vendors | Ayceebuilder Nigeria",
    description: "Browse trusted vendors of construction materials in Nigeria. Find quality suppliers for your building projects.",
  }
};

const page = () => {
  return (
    <div>
      <Vendors />
    </div>
  );
};

export default page;
