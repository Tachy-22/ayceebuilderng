import { NextRequest, NextResponse } from "next/server";
import { getCollection, batchWrite, isFirebaseError } from '@/lib/firebase-utils';
import { mapNewProductToProduct, ProductNew } from '@/data/products';

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwT0TdiN9b9pa7ihupog_ztKDe9C3KK2BvGef4X_Zpy1W-pRJf7vupnqAXQB8cQuw-W/exec";

export async function POST(request: NextRequest) {
  try {
    const { category, force = false } = await request.json();

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required'
      }, { status: 400 });
    }


    // Check if products already exist for this category (unless force migration)
    if (!force) {
      const existingResult = await getCollection('products', {
        filters: [{ field: 'category', operator: '==', value: category }]
      });
      
      if (isFirebaseError(existingResult)) {
        return NextResponse.json(existingResult, { status: 500 });
      }
      
      if (existingResult.data.length > 0) {
        return NextResponse.json({
          success: false,
          error: `Products already exist for category "${category}". Use force=true to overwrite.`,
          existingCount: existingResult.data.length,
          category
        }, { status: 400 });
      }
    }

    const migrationResult = {
      success: true,
      category,
      totalProducts: 0,
      migratedProducts: 0,
      errors: [] as string[],
      pages: [] as any[]
    };

  //  console.log(`Starting migration for category: ${category}`);
    
    try {
      // Fetch all products from Google Sheets for this category
      let allProducts: ProductNew[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const pageLimit = 100; // Large page size for migration
      
      while (hasMorePages) {
        const sheetUrl = `${GOOGLE_SCRIPT_URL}?page=${currentPage}&limit=${pageLimit}&sheet=${category}`;
      //  console.log(`Fetching ${category} page ${currentPage}: ${sheetUrl}`);
        
        const sheetResponse = await fetch(sheetUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!sheetResponse.ok) {
          const error = `Failed to fetch ${category} page ${currentPage}: ${sheetResponse.statusText}`;
          migrationResult.errors.push(error);
          break;
        }

        const pageData = await sheetResponse.json();
        const pageInfo = {
          page: currentPage,
          hasData: pageData.data && Array.isArray(pageData.data),
          dataLength: pageData.data ? pageData.data.length : 0,
          totalPages: pageData.totalPages
        };
        
        migrationResult.pages.push(pageInfo);
      //  console.log(`${category} page ${currentPage} response:`, pageInfo);

        // Check if the response has the expected structure
        if (!pageData.data || !Array.isArray(pageData.data)) {
          const error = `Invalid response structure for ${category} page ${currentPage}`;
          migrationResult.errors.push(error);
          break;
        }

        // Add this page's products to the collection
        allProducts = allProducts.concat(pageData.data);

        // Check if there are more pages
        hasMorePages = pageData.totalPages && currentPage < pageData.totalPages;
        currentPage++;

        // Safety check to prevent infinite loops
        if (currentPage > 50) {
          console.warn(`Safety limit reached for ${category}, stopping at page 50`);
          break;
        }
      }

      if (allProducts.length === 0) {
        return NextResponse.json({
          success: false,
          error: `No products found for category: ${category}`,
          category,
          pages: migrationResult.pages
        }, { status: 404 });
      }

      migrationResult.totalProducts = allProducts.length;
    //  console.log(`Found ${allProducts.length} products for ${category}, starting migration...`);

      // If force migration, delete existing products for this category
      if (force) {
        const existingResult = await getCollection('products', {
          filters: [{ field: 'category', operator: '==', value: category }]
        });
        
        if (!isFirebaseError(existingResult) && existingResult.data.length > 0) {
        //  console.log(`Deleting ${existingResult.data.length} existing products for ${category}`);
          const deleteOperations = existingResult.data.map(product => ({
            type: 'delete' as const,
            collection: 'products',
            documentId: product.id
          }));
          
          const deleteResult = await batchWrite(deleteOperations);
          if (isFirebaseError(deleteResult)) {
            return NextResponse.json(deleteResult, { status: 500 });
          }
        }
      }

      // Process products in batches (Firestore limit is 500 operations per batch)
      const batchSize = 400;
      const productBatches = [];
      
      for (let i = 0; i < allProducts.length; i += batchSize) {
        productBatches.push(allProducts.slice(i, i + batchSize));
      }

      // Migrate each batch
      for (let batchIndex = 0; batchIndex < productBatches.length; batchIndex++) {
        const currentBatch = productBatches[batchIndex];
        const batchOperations = [];

        for (let j = 0; j < currentBatch.length; j++) {
          try {
            const rawProduct = currentBatch[j];
            const globalIndex = (batchIndex * batchSize) + j;
            
            // Convert to proper Product format
            const product = mapNewProductToProduct(rawProduct, globalIndex);
            
            // Generate a unique ID for the product
            const productId = `${category}_${product.id || globalIndex}`;
            
            // Clean up undefined values for Firestore
            const cleanProduct = {
              ...product,
              id: productId,
              category: category, // Ensure category is set correctly
              subCategory: product.subCategory || null,
              discountPrice: product.discountPrice || null,
              migratedFrom: 'google_sheets',
              originalSheetName: category
            };

            // Remove any remaining undefined values
            Object.keys(cleanProduct).forEach(key => {
              if (cleanProduct[key as keyof typeof cleanProduct] === undefined) {
                delete cleanProduct[key as keyof typeof cleanProduct];
              }
            });
            
            // Add to batch operations
            batchOperations.push({
              type: 'add' as const,
              collection: 'products',
              documentId: productId,
              data: cleanProduct
            });

            migrationResult.migratedProducts++;
            
          } catch (productError) {
            const error = `Error processing product ${j} in ${category}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
            console.error(error);
            migrationResult.errors.push(error);
          }
        }

        // Commit the batch
        if (batchOperations.length > 0) {
          const batchResult = await batchWrite(batchOperations);
          if (isFirebaseError(batchResult)) {
            migrationResult.errors.push(`Batch ${batchIndex + 1} failed: ${batchResult.error}`);
          } else {
          //  console.log(`Committed batch ${batchIndex + 1}/${productBatches.length} for ${category} (${currentBatch.length} products)`);
          }
        }
      }

    //  console.log(`Completed migration for ${category}: ${migrationResult.migratedProducts} products`);
      
    } catch (categoryError) {
      const error = `Error migrating category ${category}: ${categoryError instanceof Error ? categoryError.message : 'Unknown error'}`;
      console.error(error);
      migrationResult.errors.push(error);
      migrationResult.success = false;
    }

    const isSuccess = migrationResult.migratedProducts > 0;
    
    return NextResponse.json({
      ...migrationResult,
      success: isSuccess,
      message: isSuccess 
        ? `Successfully migrated ${migrationResult.migratedProducts} products for category "${category}"`
        : `Failed to migrate category "${category}"`
    }, { 
      status: isSuccess ? 200 : 500 
    });

  } catch (error) {
    console.error("Error in category migration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: "Category migration failed during execution"
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check category status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category parameter is required'
      }, { status: 400 });
    }

    const productsResult = await getCollection('products', {
      filters: [{ field: 'category', operator: '==', value: category }]
    });
    
    if (isFirebaseError(productsResult)) {
      return NextResponse.json(productsResult, { status: 500 });
    }
    
    const products = productsResult.data;

    return NextResponse.json({
      success: true,
      category,
      exists: products.length > 0,
      productCount: products.length,
      sampleProducts: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        inStock: p.inStock
      }))
    });
    
  } catch (error) {
    console.error("Error checking category status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}