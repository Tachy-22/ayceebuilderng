import { NextRequest, NextResponse } from "next/server";
import { addDocument, isFirebaseError } from '@/lib/firebase-utils';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const vendorData = await request.json();

    // Add vendor to Firebase
    const result = await addDocument('vendors', {
      ...vendorData,
      status: 'pending', // Default status for new vendors
    });

    if (isFirebaseError(result)) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: result.data.id,
      message: 'Vendor registration submitted successfully'
    });
  } catch (error) {
    console.error("Error in vendor API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to submit vendor data",
      },
      { status: 500 }
    );
  }
}

// GET method removed - use /api/vendors for fetching vendors
