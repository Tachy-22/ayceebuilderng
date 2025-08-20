import { NextRequest, NextResponse } from "next/server";
import { adminDb } from '@/lib/firebase-admin';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Product } from "@/data/products";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const inStock = searchParams.get('inStock') === 'true';

    console.log('Advanced products search with params:', {
      page,
      limit: limitParam,
      category,
      searchTerm,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection,
      inStock
    });

    if (!adminDb) {
      throw new Error('Firebase Admin database not initialized');
    }

    const productsRef = collection(adminDb, 'products');
    let baseQuery = query(productsRef);

    // Apply category filter
    if (category && category !== 'all') {
      baseQuery = query(baseQuery, where('category', '==', category));
    }

    // Apply price range filter
    if (minPrice > 0) {
      baseQuery = query(baseQuery, where('price', '>=', minPrice));
    }
    if (maxPrice < 999999999) {
      baseQuery = query(baseQuery, where('price', '<=', maxPrice));
    }

    // Apply stock filter
    if (inStock) {
      baseQuery = query(baseQuery, where('inStock', '==', true));
    }

    // Apply sorting
    const sortField = sortBy === 'price' ? 'price' : 
                     sortBy === 'name' ? 'name' : 
                     sortBy === 'rating' ? 'rating' : 'createdAt';
    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    
    baseQuery = query(baseQuery, orderBy(sortField, direction));

    // Handle search separately due to Firebase limitations
    let searchResults: any[] = [];
    
    if (searchTerm) {
      // For better search, we'll fetch more results and filter client-side
      // In production, consider using Algolia, Elasticsearch, or similar
      const searchQuery = query(productsRef, limit(1000));
      const searchSnapshot = await getDocs(searchQuery);
      
      const allProducts: Product[] = searchSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Client-side search filtering
      const searchLower = searchTerm.toLowerCase();
      searchResults = allProducts.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.subCategory?.toLowerCase().includes(searchLower)
      );

      // Apply pagination to search results
      const totalItems = searchResults.length;
      const totalPages = Math.ceil(totalItems / limitParam);
      const startIndex = (page - 1) * limitParam;
      const endIndex = startIndex + limitParam;
      
      const paginatedResults = searchResults.slice(startIndex, endIndex);

      return NextResponse.json({
        success: true,
        data: paginatedResults,
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
          minPrice,
          maxPrice,
          sortBy,
          sortDirection,
          inStock
        },
        searchMode: true
      });
    }

    // Regular query without search
    // Get total count for pagination
    const countSnapshot = await getDocs(baseQuery);
    const totalItems = countSnapshot.size;
    const totalPages = Math.ceil(totalItems / limitParam);

    // Apply pagination using limit - note: offset is not available in client SDK
    const paginatedQuery = query(baseQuery, limit(page * limitParam));

    // Execute the query
    const snapshot = await getDocs(paginatedQuery);
    
    // Client-side pagination to get the correct page
    const startIndex = (page - 1) * limitParam;
    const allResults = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const products = allResults.slice(startIndex, startIndex + limitParam);
    

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
        minPrice,
        maxPrice,
        sortBy,
        sortDirection,
        inStock
      },
      searchMode: false
    });

  } catch (error) {
    console.error('Error in advanced products search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}