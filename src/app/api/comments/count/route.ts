import { NextRequest, NextResponse } from "next/server";
import { getCollectionCount, isFirebaseError } from "@/lib/firebase-utils";

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

    // Get the count of comments for the specified blog
    const countResult = await getCollectionCount("comments", {
      filters: [{ field: "blogId", operator: "==", value: blogId }]
    });

    if (isFirebaseError(countResult)) {
      return NextResponse.json(countResult, { status: 500 });
    }

    return NextResponse.json({ count: countResult.data });
  } catch (error) {
    console.error("Error getting comment count:", error);
    return NextResponse.json(
      { error: "Failed to get comment count" },
      { status: 500 }
    );
  }
}
