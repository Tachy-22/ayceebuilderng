import { NextResponse } from "next/server";
import { getCollection, isFirebaseError } from '@/lib/firebase-utils';
import { Product } from '@/data/products';

export async function GET() {
  try {
    //console.log('Fetching product categories from Firebase...');

    // Get all products with category ordering
    const productsResult = await getCollection<Product>('products', {
      orderBy: [{ field: 'category', direction: 'asc' }]
    });

    if (isFirebaseError(productsResult)) {
      return NextResponse.json(productsResult, { status: 500 });
    }

    const products = productsResult.data;

    // Extract unique categories with counts
    const categoryMap = new Map<string, { name: string; count: number; sample?: any }>();

    products.forEach((product) => {
      const category = product.category;
      
      // Debug: log category info for first few products
      if (categoryMap.size < 5) {
        // console.log('Product category debug:', {
        //   id: product.id,
        //   name: product.name,
        //   category: product.category,
        //   Category: (product as any).Category,
        //   sheetName: (product as any).sheetName
        // });
      }
      
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
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image
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

   // console.log(`Found ${categories.length} categories`);
    //console.log('All categories found:', categories.map(c => ({ id: c.id, name: c.name, count: c.count })));

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