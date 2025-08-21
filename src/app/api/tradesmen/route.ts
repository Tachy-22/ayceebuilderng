import { NextRequest, NextResponse } from 'next/server';
import { getCollection, isFirebaseError } from '@/lib/firebase-utils';

export async function GET() {
  try {
    const tradesmenResult = await getCollection('tradesmen');
    
    if (isFirebaseError(tradesmenResult)) {
      return NextResponse.json(tradesmenResult, { status: 500 });
    }

    const tradesmenData = tradesmenResult.data;
    console.log({ tradesmenData })
    
    // Filter approved tradesmen and sort by featured/rating
    const approvedTradesmen = tradesmenData
      .filter((tradesman: any) => tradesman.status === 'approved')
      .sort((a: any, b: any) => {
        // Featured first, then by rating
        if (a.featured !== b.featured) return b.featured ? 1 : -1;
        return b.rating - a.rating;
      });

    return NextResponse.json({ success: true, data: approvedTradesmen });
  } catch (error) {
    console.error('Error fetching tradesmen:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tradesmen' },
      { status: 500 }
    );
  }
}