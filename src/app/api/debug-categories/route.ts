import { NextResponse } from "next/server";
import { getCollection, isFirebaseError } from '@/lib/firebase-utils';

export async function GET() {
  try {
    console.log('=== DEBUG CATEGORIES API ===');
    
    // Get first 10 products to see their actual category values
    const result = await getCollection('products', {
      limit: 10
    });

    if (isFirebaseError(result)) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const products = result.data;
    console.log('Sample products and their categories:');
    
    const categoryInfo = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      rawCategory: (product as any).Category,
      sheetName: (product as any).sheetName
    }));
    
    console.table(categoryInfo);
    
    // Get unique categories
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    console.log('Unique categories found:', uniqueCategories);
    
    // Test a specific category filter
    const testCategory = uniqueCategories[0];
    if (testCategory) {
      console.log(`Testing filter for category: "${testCategory}"`);
      
      const filteredResult = await getCollection('products', {
        filters: [{ field: 'category', operator: '==', value: testCategory }]
      });
      
      if (!isFirebaseError(filteredResult)) {
        console.log(`Found ${filteredResult.data.length} products in category "${testCategory}"`);
      }
    }

    return NextResponse.json({
      success: true,
      sampleProducts: categoryInfo,
      uniqueCategories,
      testFilter: testCategory ? {
        category: testCategory,
        resultCount: !isFirebaseError(result) ? result.data.length : 0
      } : null
    });

  } catch (error) {
    console.error('Debug categories error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}