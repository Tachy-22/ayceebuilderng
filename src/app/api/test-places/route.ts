import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Places API key not found" },
        { status: 500 }
      );
    }

    // Test with a simple place search
    const testQuery = "Shoprite Ikeja Nigeria";
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(testQuery)}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${apiKey}`;
    
    console.log('Testing Google Places API with URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Google Places API response:', data);
    
    return NextResponse.json({
      apiKeyPresent: !!apiKey,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      testQuery,
      response: data,
      status: response.status
    });
    
  } catch (error) {
    console.error("Error testing Google Places API:", error);
    return NextResponse.json(
      { error: "Failed to test Google Places API", details: error },
      { status: 500 }
    );
  }
}