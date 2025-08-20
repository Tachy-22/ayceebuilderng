import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const tradesmanData = await request.json();

    // Add tradesman to Firebase
    const tradesmenRef = collection(db, 'tradesmen');
    const docRef = await addDoc(tradesmenRef, {
      ...tradesmanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending', // Default status for new tradesmen
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
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
