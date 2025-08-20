import { NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('Fetching product categories from Firebase...');

    if (!adminDb) {
      throw new Error('Firebase Admin database not initialized');
    }

    const productsRef = collection(adminDb, 'products');
    const productsQuery = query(productsRef, orderBy('category'));
    const snapshot = await getDocs(productsQuery);

    // Extract unique categories with counts
    const categoryMap = new Map<string, { name: string; count: number; sample?: any }>();

    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const category = data.category;
      
      if (category) {
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)!;
          categoryMap.set(category, {
            ...existing,
            count: existing.count + 1
          });
        } else {
          categoryMap.set(category, {
            name: category,
            count: 1,
            sample: {
              id: doc.id,
              name: data.name,
              price: data.price,
              image: data.image
            }
          });
        }
      }
    });

    // Convert to array and sort by count (most products first)
    const categories = Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      ...data
    })).sort((a, b) => b.count - a.count);

    console.log(`Found ${categories.length} categories`);

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}