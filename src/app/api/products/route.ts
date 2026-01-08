import { NextRequest, NextResponse } from "next/server";
import { getCollection, isFirebaseError, QueryFilter, QueryOrder } from '@/lib/firebase-utils';

export async function GET(request: NextRequest) {
  try {
   // console.log('Products API: Starting request...');
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    const featured = searchParams.get('featured') === 'true';

   // console.log('Products API called with params:', {
    //   page,
    //   limit: limitParam,
    //   category,
    //   searchTerm,
    //   sortBy,
    //   sortDirection,
    //   featured
    // });

   // console.log('Raw URL search params:', {
    //   categoryRaw: searchParams.get('category'),
    //   allParams: Object.fromEntries(searchParams.entries())
    // });

    // Build filters
    const filters: QueryFilter[] = [];
    
    // Apply category filter
    if (category && category !== 'all') {
     // console.log('Adding category filter:', { field: 'category', operator: '==', value: category });
      filters.push({ field: 'category', operator: '==', value: category });
    } else {
     // console.log('No category filter applied, category:', category);
    }

    // Apply featured filter
    if (featured) {
     // console.log('Adding featured filter:', { field: 'featured', operator: '==', value: true });
      filters.push({ field: 'featured', operator: '==', value: true });
    }

    // Apply search filter for name (basic text search)
    if (searchTerm) {
      // Firebase text search limitations - using range queries
      filters.push({ field: 'name', operator: '>=', value: searchTerm });
      filters.push({ field: 'name', operator: '<=', value: searchTerm + '\uf8ff' });
    }

    // Build ordering
    const orderBy: QueryOrder[] = [];
    const sortField = sortBy === 'price' ? 'price' : 
                     sortBy === 'name' ? 'name' : 
                     sortBy === 'rating' ? 'rating' : 'createdAt';
    const direction = sortDirection === 'asc' ? 'asc' : 'asc';
    
    // Only apply ordering if no search term (to avoid Firebase index requirements)
    if (!searchTerm) {
      orderBy.push({ field: sortField, direction });
    }

   // console.log('Products API: Fetching products with filters and ordering...');
   // console.log('Final filters being sent to Firebase:', filters);
   // console.log('Final orderBy being sent to Firebase:', orderBy);
    
    // Get all matching products (we'll handle pagination client-side for now)
    const result = await getCollection('products', {
      filters,
      orderBy,
      
    });

    if (isFirebaseError(result)) {
      console.error('Firebase error:', result);
      return NextResponse.json(result, { status: 500 });
    }

    let products = result.data;
   // console.log(`Firebase returned ${products.length} products`);
    
    // Log first few products to see their category values
    if (products.length > 0) {
     // console.log('Sample product categories:', products.slice(0, 3).map(p => ({ 
      //   id: p.id, 
      //   name: p.name, 
      //   category: p.category 
      // })));
    }

    // Apply client-side sorting if we had search term
    if (searchTerm) {
      products.sort((a: any, b: any) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (direction === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    // Apply pagination client-side
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / limitParam);
    const startIndex = (page - 1) * limitParam;
    const endIndex = startIndex + limitParam;
    const paginatedProducts = products.slice(startIndex, endIndex);

   // console.log(`Found ${totalItems} total products, returning ${paginatedProducts.length} for page ${page}`);
    
    // Debug: Log final results to see if filtering worked
    if (category && category !== 'all' && paginatedProducts.length > 0) {
     // console.log('Final paginated results - first 3 products:', paginatedProducts.slice(0, 3).map(p => ({ 
      //   id: p.id, 
      //   name: p.name, 
      //   category: p.category 
      // })));
    }

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limitParam,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        category,
        searchTerm,
        sortBy,
        sortDirection
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}