import { NextRequest, NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwT0TdiN9b9pa7ihupog_ztKDe9C3KK2BvGef4X_Zpy1W-pRJf7vupnqAXQB8cQuw-W/exec";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sheet = searchParams.get("sheet") || "tiles"; // Default to tiles for testing
  
  try {
   // console.log(`Testing sheet: ${sheet}`);
   // console.log(`URL: ${GOOGLE_SCRIPT_URL}?page=1&limit=5&sheet=${sheet}`);
    
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?page=1&limit=5&sheet=${sheet}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

   // console.log(`Response status: ${response.status}`);
   // console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
     // console.log(`Error response:`, errorText);
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
        sheet,
        url: `${GOOGLE_SCRIPT_URL}?sheet=${sheet}`
      }, { status: response.status });
    }

    const data = await response.json();
   // console.log(`Response data type:`, typeof data);
   // console.log(`Response data length:`, Array.isArray(data) ? data.length : 'Not an array');
   // console.log(`Sample data (first 2 items):`, Array.isArray(data) ? data.slice(0, 2) : data);

    return NextResponse.json({
      success: true,
      sheet,
      url: `${GOOGLE_SCRIPT_URL}?sheet=${sheet}`,
      dataType: typeof data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : null,
      sampleData: Array.isArray(data) ? data.slice(0, 3) : data,
      rawResponse: data
    });

  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      sheet,
      url: `${GOOGLE_SCRIPT_URL}?sheet=${sheet}`
    }, { status: 500 });
  }
}

// Test all sheets
export async function POST() {
  const sheets = ['tiles', 'electrical', 'paint', 'sanitaryware', 'cladding', 'adhesive and admix', 'plumbing', 'lighting'];
  const results: any[] = [];
  
  for (const sheet of sheets) {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?page=1&limit=5&sheet=${sheet}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      results.push({
        sheet,
        success: response.ok,
        status: response.status,
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: Array.isArray(data) ? data.length : null,
        hasData: Array.isArray(data) && data.length > 0,
        sampleItem: Array.isArray(data) && data.length > 0 ? data[0] : null
      });
    } catch (error) {
      results.push({
        sheet,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
  
  return NextResponse.json({
    success: true,
    results,
    summary: {
      total: sheets.length,
      working: results.filter(r => r.success && r.hasData).length,
      empty: results.filter(r => r.success && !r.hasData).length,
      errors: results.filter(r => !r.success).length
    }
  });
}