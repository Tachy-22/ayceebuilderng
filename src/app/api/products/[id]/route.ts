import { NextRequest, NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Product } from "@/data/products";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required'
        },
        { status: 400 }
      );
    }

    console.log(`Fetching product with ID: ${productId}`);

    if (!adminDb) {
      throw new Error('Firebase Admin database not initialized');
    }

    // Get the product document
    const productRef = doc(adminDb, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found'
        },
        { status: 404 }
      );
    }

    const productData = {
      id: productDoc.id,
      ...productDoc.data()
    } as Product;

    // Get related products from the same category
    const productsRef = collection(adminDb, 'products');
    const relatedQuery = query(
      productsRef,
      where('category', '==', productData.category),
      limit(6)
    );
    
    const relatedSnapshot = await getDocs(relatedQuery);
    const relatedProducts = relatedSnapshot.docs
      .filter((doc: any) => doc.id !== productId) // Exclude the current product
      .slice(0, 4) // Get only 4 related products
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));

    console.log(`Found product: ${productData.name} with ${relatedProducts.length} related products`);

    return NextResponse.json({
      success: true,
      data: productData,
      relatedProducts: relatedProducts
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const updates = await request.json();

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required'
        },
        { status: 400 }
      );
    }

    // This endpoint can be used for updating product data
    // For now, we'll just return the product data
    // In a full implementation, you'd update the document in Firebase

    console.log(`Update request for product: ${productId}`, updates);

    return NextResponse.json({
      success: true,
      message: 'Product update endpoint - implementation pending',
      productId,
      updates
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}