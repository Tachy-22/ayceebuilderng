import { NextRequest, NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Products API: Starting request...');
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    console.log('Products API called with params:', {
      page,
      limit: limitParam,
      category,
      searchTerm,
      sortBy,
      sortDirection
    });

    // Test Firebase Admin connection
    console.log('Products API: Testing Firebase Admin connection...');
    if (!adminDb) {
      throw new Error('Firebase Admin database not initialized');
    }

    console.log('Products API: Creating collection reference...');
    const productsRef = collection(adminDb, 'products');
    console.log('Products API: Collection reference created');
    
    let baseQuery = query(productsRef);

    // Apply category filter
    if (category && category !== 'all') {
      baseQuery = query(baseQuery, where('category', '==', category));
    }

    // Apply search filter (note: this is basic text search)
    if (searchTerm) {
      // Firebase doesn't support full-text search natively
      // This is a simple approach - for better search, consider using Algolia or similar
      baseQuery = query(baseQuery, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    }

    // Apply sorting - only if no filters are applied to avoid index requirements
    // When filtering by category, we'll do client-side sorting instead
    if (category === 'all' && !searchTerm) {
      const sortField = sortBy === 'price' ? 'price' : 
                       sortBy === 'name' ? 'name' : 
                       sortBy === 'rating' ? 'rating' : 'createdAt';
      const direction = sortDirection === 'asc' ? 'asc' : 'desc';
      
      baseQuery = query(baseQuery, orderBy(sortField, direction));
    }

    // Get total count for pagination
    console.log('Products API: Getting count...');
    const countSnapshot = await getDocs(baseQuery);
    const totalItems = countSnapshot.size;
    console.log('Products API: Count retrieved:', totalItems);
    
    const totalPages = Math.ceil(totalItems / limitParam);

    // Apply pagination
    if (page > 1) {
      // Get the last document from the previous page for pagination
      const prevPageQuery = query(baseQuery, limit((page - 1) * limitParam));
      const prevPageSnapshot = await getDocs(prevPageQuery);
      
      if (!prevPageSnapshot.empty) {
        const lastDoc = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];
        baseQuery = query(baseQuery, startAfter(lastDoc), limit(limitParam));
      } else {
        baseQuery = query(baseQuery, limit(limitParam));
      }
    } else {
      baseQuery = query(baseQuery, limit(limitParam));
    }

    // Execute the query
    console.log('Products API: Executing paginated query...');
    const snapshot = await getDocs(baseQuery);
    
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply client-side sorting if we have filters (to avoid Firebase index requirements)
    if (category !== 'all' || searchTerm) {
      const sortField = sortBy === 'price' ? 'price' : 
                       sortBy === 'name' ? 'name' : 
                       sortBy === 'rating' ? 'rating' : 'createdAt';
      const direction = sortDirection === 'asc' ? 'asc' : 'desc';
      
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

    console.log(`Found ${products.length} products for page ${page}`);

    return NextResponse.json({
      success: true,
      data: products,
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