import { NextRequest, NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGAOxbMYE975ofGeJcJderdFq8MnIrgsRUU84S6jnSH76evqmMNhTeTLUe8RTBwsqF/exec";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const vendorData = await request.json();

    // Forward the request to the Google Script API
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorData),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `Failed to submit data: ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Parse and forward the response from the Google Script
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in vendor API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the search params from the request URL
    const searchParams = request.nextUrl.searchParams;
    const sheet = searchParams.get("sheet");

    // Build the URL with search params for the Google Script
    let url = GOOGLE_SCRIPT_URL;
    if (sheet) {
      url += `?sheet=${sheet}`;
    }

    // Forward the request to the Google Script API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch data: ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Parse and forward the response from the Google Script
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in vendor API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
