import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    // Get the blogId from the URL query parameters
    const url = new URL(request.url);
    const blogId = url.searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Query the comments collection to count comments for the specified blog
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("blogId", "==", blogId));

    // Get the count using Firestore's getCountFromServer
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting comment count:", error);
    return NextResponse.json(
      { error: "Failed to get comment count" },
      { status: 500 }
    );
  }
}
