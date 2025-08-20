import { NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('Testing Firebase Admin connection...');
    
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin database not initialized',
        suggestion: 'Check Firebase Admin configuration'
      }, { status: 500 });
    }
    
    console.log('Firebase Admin DB instance exists, testing collection access...');
    
    // Test basic connection by trying to read from products collection
    const productsRef = collection(adminDb, 'products');
    console.log('Products collection reference created');
    
    console.log('Test query created, executing...');
    const testQuery = query(productsRef, limit(1));
    const snapshot = await getDocs(testQuery);
    console.log('Query executed successfully');
    
    const hasProducts = !snapshot.empty;
    const productCount = snapshot.size;
    
    console.log(`Firebase Admin test: ${hasProducts ? 'SUCCESS' : 'NO_DATA'} - Found ${productCount} products`);
    
    if (hasProducts) {
      const firstProduct = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
      
      return NextResponse.json({
        success: true,
        message: 'Firebase Admin connection successful',
        hasProducts: true,
        productCount,
        sampleProduct: firstProduct
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Firebase Admin connection successful but no products found',
        hasProducts: false,
        productCount: 0,
        suggestion: 'Run the migration tool to import products from Google Sheets'
      });
    }
    
  } catch (error) {
    console.error('Firebase Admin test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Firebase Admin connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check Firebase configuration and environment variables'
      },
      { status: 500 }
    );
  }
}