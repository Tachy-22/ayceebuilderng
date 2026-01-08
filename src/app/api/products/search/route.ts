import { NextRequest, NextResponse } from "next/server";
import { getCollection, isFirebaseError, QueryFilter, QueryOrder } from '@/lib/firebase-utils';
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

   // console.log('Advanced products search with params:', {
    //   page,
    //   limit: limitParam,
    //   category,
    //   searchTerm,
    //   minPrice,
    //   maxPrice,
    //   sortBy,
    //   sortDirection,
    //   inStock
    // });

    // Build filters for Firebase utilities
    const filters: QueryFilter[] = [];

    // Apply category filter
    if (category && category !== 'all') {
      filters.push({ field: 'category', operator: '==', value: category });
    }

    // Apply price range filter
    if (minPrice > 0) {
      filters.push({ field: 'price', operator: '>=', value: minPrice });
    }
    if (maxPrice < 999999999) {
      filters.push({ field: 'price', operator: '<=', value: maxPrice });
    }

    // Apply stock filter
    if (inStock) {
      filters.push({ field: 'inStock', operator: '==', value: true });
    }

    // Apply sorting
    const sortField = sortBy === 'price' ? 'price' : 
                     sortBy === 'name' ? 'name' : 
                     sortBy === 'rating' ? 'rating' : 'createdAt';
    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    
    const orderBy: QueryOrder[] = [{ field: sortField, direction }];

    // Handle search separately due to Firebase limitations
    if (searchTerm) {
      // For better search, we'll fetch all products and filter client-side
      // In production, consider using Algolia, Elasticsearch, or similar
      const allProductsResult = await getCollection<Product>('products', {
        limit: 1000 // Get a large number for client-side filtering
      });

      if (isFirebaseError(allProductsResult)) {
        return NextResponse.json(allProductsResult, { status: 500 });
      }

      // Client-side search filtering
      const searchLower = searchTerm.toLowerCase();
      let searchResults = allProductsResult.data.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.subCategory?.toLowerCase().includes(searchLower)
      );

      // Apply additional filters client-side
      if (category && category !== 'all') {
        searchResults = searchResults.filter(p => p.category === category);
      }
      if (minPrice > 0) {
        searchResults = searchResults.filter(p => (p.price || 0) >= minPrice);
      }
      if (maxPrice < 999999999) {
        searchResults = searchResults.filter(p => (p.price || 0) <= maxPrice);
      }
      if (inStock) {
        searchResults = searchResults.filter(p => p.inStock === true);
      }

      // Apply sorting
      searchResults.sort((a: any, b: any) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (direction === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });

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
    const productsResult = await getCollection<Product>('products', {
      filters,
      orderBy
    });

    if (isFirebaseError(productsResult)) {
      return NextResponse.json(productsResult, { status: 500 });
    }

    // Apply pagination client-side
    const totalItems = productsResult.data.length;
    const totalPages = Math.ceil(totalItems / limitParam);
    const startIndex = (page - 1) * limitParam;
    const endIndex = startIndex + limitParam;
    
    const products = productsResult.data.slice(startIndex, endIndex);

    //console.log(`Found ${products.length} products for page ${page}`);

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