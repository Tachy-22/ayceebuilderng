import { NextRequest, NextResponse } from "next/server";
import { addDocument, isFirebaseError } from '@/lib/firebase-utils';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const tradesmanData = await request.json();

    // Add tradesman to Firebase
    const result = await addDocument('tradesmen', {
      ...tradesmanData,
      status: 'pending', // Default status for new tradesmen
    });

    if (isFirebaseError(result)) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: result.data.id,
      message: 'Tradesman registration submitted successfully'
    });
  } catch (error) {
    console.error("Error in tradesman API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to submit tradesman data",
      },
      { status: 500 }
    );
  }
}

// GET method removed - use /api/tradesmen for fetching tradesmen
