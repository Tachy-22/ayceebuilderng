import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/data/products";
import { getDocument, getCollection, isFirebaseError } from "@/lib/firebase-utils";

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

   // console.log(`Fetching product with ID: ${productId}`);

    // Get the product document
    const productResult = await getDocument<Product>('products', productId);

    if (isFirebaseError(productResult)) {
      return NextResponse.json(productResult, { status: 500 });
    }

    if (!productResult.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found'
        },
        { status: 404 }
      );
    }

    const productData = productResult.data;

    // Get related products from the same category
    const relatedResult = await getCollection<Product>('products', {
      filters: [{ field: 'category', operator: '==', value: productData.category }],
      limit: 6
    });

    let relatedProducts: Product[] = [];
    if (!isFirebaseError(relatedResult)) {
      relatedProducts = relatedResult.data
        .filter(product => product.id !== productId) // Exclude the current product
        .slice(0, 4); // Get only 4 related products
    }

   // console.log(`Found product: ${productData.name} with ${relatedProducts.length} related products`);

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

   // console.log(`Update request for product: ${productId}`, updates);

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