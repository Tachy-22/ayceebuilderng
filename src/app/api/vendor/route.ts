import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const vendorData = await request.json();

    // Add vendor to Firebase
    const vendorsRef = collection(db, 'vendors');
    const docRef = await addDoc(vendorsRef, {
      ...vendorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending', // Default status for new vendors
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
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
