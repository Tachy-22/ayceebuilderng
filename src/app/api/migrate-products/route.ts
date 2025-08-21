import { NextRequest, NextResponse } from "next/server";
import { getCollection, batchWrite, isFirebaseError } from '@/lib/firebase-utils';
import { mapNewProductToProduct, ProductNew, categories } from '@/data/products';

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwT0TdiN9b9pa7ihupog_ztKDe9C3KK2BvGef4X_Zpy1W-pRJf7vupnqAXQB8cQuw-W/exec";

export async function POST(request: NextRequest) {
  try {
    const { force = false } = await request.json();

    // Check if products already exist (unless force migration)
    if (!force) {
      const existingResult = await getCollection('products');
      
      if (isFirebaseError(existingResult)) {
        return NextResponse.json(existingResult, { status: 500 });
      }
      
      if (existingResult.data.length > 0) {
        return NextResponse.json({
          success: false,
          error: 'Products already exist in Firebase. Use force=true to overwrite.',
          existingCount: existingResult.data.length
        }, { status: 400 });
      }
    }

    const migrationResults = {
      success: true,
      totalCategories: categories.length,
      migratedCategories: 0,
      totalProducts: 0,
      migratedProducts: 0,
      errors: [] as string[],
      categories: {} as Record<string, { count: number, errors: string[] }>
    };

    // Migrate products for each category
    for (const category of categories) {
      const categoryId = category.id;
      console.log(`Migrating category: ${categoryId}`);
      
      migrationResults.categories[categoryId] = { count: 0, errors: [] };

      try {
        // Fetch products from Google Sheets for this category
        // Start with page 1 and a large limit to get all products
        let allProducts: ProductNew[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const pageLimit = 100; // Large page size for migration
        
        while (hasMorePages) {
          const sheetUrl = `${GOOGLE_SCRIPT_URL}?page=${currentPage}&limit=${pageLimit}&sheet=${categoryId}`;
          console.log(`Fetching ${categoryId} page ${currentPage}: ${sheetUrl}`);
          
          const sheetResponse = await fetch(sheetUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!sheetResponse.ok) {
            const error = `Failed to fetch ${categoryId} page ${currentPage}: ${sheetResponse.statusText}`;
            migrationResults.errors.push(error);
            migrationResults.categories[categoryId].errors.push(error);
            break;
          }

          const pageData = await sheetResponse.json();
          console.log(`${categoryId} page ${currentPage} response:`, {
            hasData: pageData.data && Array.isArray(pageData.data),
            dataLength: pageData.data ? pageData.data.length : 0,
            totalPages: pageData.totalPages,
            currentPage: pageData.page
          });

          // Check if the response has the expected structure
          if (!pageData.data || !Array.isArray(pageData.data)) {
            const error = `Invalid response structure for ${categoryId} page ${currentPage}`;
            migrationResults.errors.push(error);
            migrationResults.categories[categoryId].errors.push(error);
            break;
          }

          // Add this page's products to the collection
          allProducts = allProducts.concat(pageData.data);

          // Check if there are more pages
          hasMorePages = pageData.totalPages && currentPage < pageData.totalPages;
          currentPage++;

          // Safety check to prevent infinite loops
          if (currentPage > 50) {
            console.warn(`Safety limit reached for ${categoryId}, stopping at page 50`);
            break;
          }
        }

        const rawProducts = allProducts;
        
        if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
          const error = `No products found for category: ${categoryId}`;
          migrationResults.errors.push(error);
          migrationResults.categories[categoryId].errors.push(error);
          continue;
        }

        // Process products in batches (Firestore limit is 500 operations per batch)
        const batchSize = 400; // Leave some margin
        const productBatches = [];
        
        for (let i = 0; i < rawProducts.length; i += batchSize) {
          productBatches.push(rawProducts.slice(i, i + batchSize));
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
              const productId = `${categoryId}_${product.id || globalIndex}`;
              
              // Clean up undefined values for Firestore
              const cleanProduct = {
                ...product,
                id: productId,
                // Remove undefined values
                subCategory: product.subCategory || null,
                discountPrice: product.discountPrice || null,
                migratedFrom: 'google_sheets',
                originalSheetName: categoryId
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

              migrationResults.categories[categoryId].count++;
              migrationResults.totalProducts++;
              
            } catch (productError) {
              const error = `Error processing product in ${categoryId}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
              console.error(error);
              migrationResults.categories[categoryId].errors.push(error);
              migrationResults.errors.push(error);
            }
          }

          // Commit the batch
          if (batchOperations.length > 0) {
            const batchResult = await batchWrite(batchOperations);
            if (isFirebaseError(batchResult)) {
              migrationResults.errors.push(`Batch ${batchIndex + 1} for ${categoryId} failed: ${batchResult.error}`);
            } else {
              console.log(`Committed batch ${batchIndex + 1}/${productBatches.length} for ${categoryId}`);
            }
          }
        }

        migrationResults.migratedCategories++;
        console.log(`Completed migration for ${categoryId}: ${migrationResults.categories[categoryId].count} products`);
        
      } catch (categoryError) {
        const error = `Error migrating category ${categoryId}: ${categoryError instanceof Error ? categoryError.message : 'Unknown error'}`;
        console.error(error);
        migrationResults.errors.push(error);
        migrationResults.categories[categoryId].errors.push(error);
      }
    }

    // Calculate final migration statistics
    migrationResults.migratedProducts = Object.values(migrationResults.categories)
      .reduce((total, cat) => total + cat.count, 0);

    const isSuccess = migrationResults.migratedProducts > 0;
    
    return NextResponse.json({
      ...migrationResults,
      success: isSuccess,
      message: isSuccess 
        ? `Successfully migrated ${migrationResults.migratedProducts} products from ${migrationResults.migratedCategories} categories`
        : 'Migration failed - no products were migrated'
    }, { 
      status: isSuccess ? 200 : 500 
    });

  } catch (error) {
    console.error("Error in product migration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: "Migration failed during execution"
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET() {
  try {
    const productsResult = await getCollection('products');
    
    if (isFirebaseError(productsResult)) {
      return NextResponse.json(productsResult, { status: 500 });
    }
    
    const products = productsResult.data;
    const stats = {
      totalProducts: products.length,
      categories: {} as Record<string, number>
    };

    products.forEach(product => {
      const category = product.category || 'unknown';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      migrationExists: products.length > 0,
      ...stats
    });
    
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}