import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const vendorsRef = collection(db, 'vendors');
    const q = query(vendorsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const vendorsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("here")
    console.log({ vendorsData, "ner": "here" })
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