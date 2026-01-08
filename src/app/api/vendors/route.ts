import { NextRequest, NextResponse } from 'next/server';
import { getCollection, isFirebaseError } from '@/lib/firebase-utils';

export async function GET() {
  try {
    const vendorsResult = await getCollection('vendors', {
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
    
    if (isFirebaseError(vendorsResult)) {
      return NextResponse.json(vendorsResult, { status: 500 });
    }

    const vendorsData = vendorsResult.data;
   // console.log("here")
    //console.log({ vendorsData, "ner": "here" })
    
    //Filter approved vendors and sort by featured/rating
    const approvedVendors = vendorsData
      .filter((vendor: any) => vendor.status === 'approved')
      .sort((a: any, b: any) => {
        // Featured first, then by rating
        if (a.featured !== b.featured) return b.featured ? 1 : -1;
        return b.rating - a.rating;
      });

    return NextResponse.json({ success: true, data: approvedVendors });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}