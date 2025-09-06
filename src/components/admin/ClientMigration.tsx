"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { categories, mapNewProductToProduct, ProductNew } from '@/data/products';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwT0TdiN9b9pa7ihupog_ztKDe9C3KK2BvGef4X_Zpy1W-pRJf7vupnqAXQB8cQuw-W/exec";

interface CategoryStatus {
  category: string;
  exists: boolean;
  productCount: number;
  availableInSheets?: number;
}

interface MigrationResult {
  success: boolean;
  category: string;
  totalProducts: number;
  migratedProducts: number;
  errors: string[];
  message?: string;
}

export default function ClientMigration() {
  const { user } = useAuth();
  const [categoryStatuses, setCategoryStatuses] = useState<Record<string, CategoryStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [migrating, setMigrating] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, MigrationResult>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if products exist in Firebase for a category
  const checkFirebaseStatus = async (categoryId: string): Promise<{ exists: boolean; count: number }> => {
    try {
      const productsRef = collection(db, 'products');
      const categoryQuery = query(productsRef, where('category', '==', categoryId));
      const snapshot = await getDocs(categoryQuery);

      return {
        exists: snapshot.size > 0,
        count: snapshot.size
      };
    } catch (error) {
      console.error(`Error checking Firebase status for ${categoryId}:`, error);
      return { exists: false, count: 0 };
    }
  };

  // Get actual count from Google Sheets
  const getSheetsCount = async (categoryId: string): Promise<number> => {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?page=1&limit=1&sheet=${categoryId}`);
      const data = await response.json();
      return data && typeof data.total === 'number' ? data.total : 0;
    } catch (error) {
      console.error(`Error fetching sheets count for ${categoryId}:`, error);
      return 0;
    }
  };

  // Check status for single category
  const checkCategoryStatus = async (categoryId: string) => {
    setLoading(prev => ({ ...prev, [categoryId]: true }));

    try {
      const [firebaseStatus, sheetsCount] = await Promise.all([
        checkFirebaseStatus(categoryId),
        getSheetsCount(categoryId)
      ]);

      setCategoryStatuses(prev => ({
        ...prev,
        [categoryId]: {
          category: categoryId,
          exists: firebaseStatus.exists,
          productCount: firebaseStatus.count,
          availableInSheets: sheetsCount
        }
      }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        [categoryId]: err instanceof Error ? err.message : 'Failed to check status'
      }));
    } finally {
      setLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Migrate single category (CLIENT-SIDE)
  const migrateCategory = async (categoryId: string, force = false) => {
    if (!user) {
      setErrors(prev => ({ ...prev, [categoryId]: 'You must be logged in to migrate' }));
      return;
    }

    setMigrating(prev => ({ ...prev, [categoryId]: true }));
    setErrors(prev => ({ ...prev, [categoryId]: '' }));

    const migrationResult: MigrationResult = {
      success: false,
      category: categoryId,
      totalProducts: 0,
      migratedProducts: 0,
      errors: []
    };

    try {
      // Check if products already exist (unless force migration)
      if (!force) {
        const firebaseStatus = await checkFirebaseStatus(categoryId);
        if (firebaseStatus.exists && firebaseStatus.count > 0) {
          setErrors(prev => ({
            ...prev,
            [categoryId]: `Products already exist for "${categoryId}". Use Re-migrate to overwrite.`
          }));
          return;
        }
      }

      console.log(`Starting client-side migration for category: ${categoryId}`);

      // Fetch all products from Google Sheets for this category
      let allProducts: ProductNew[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const pageLimit = 100;

      while (hasMorePages) {
        const sheetUrl = `${GOOGLE_SCRIPT_URL}?page=${currentPage}&limit=${pageLimit}&sheet=${categoryId}`;
        console.log(`Fetching ${categoryId} page ${currentPage}`);

        const sheetResponse = await fetch(sheetUrl);
        if (!sheetResponse.ok) {
          migrationResult.errors.push(`Failed to fetch page ${currentPage}: ${sheetResponse.statusText}`);
          break;
        }

        const pageData = await sheetResponse.json();
        if (!pageData.data || !Array.isArray(pageData.data)) {
          migrationResult.errors.push(`Invalid response structure for page ${currentPage}`);
          break;
        }

        allProducts = allProducts.concat(pageData.data);
        hasMorePages = pageData.totalPages && currentPage < pageData.totalPages;
        currentPage++;

        if (currentPage > 50) {
          console.warn(`Safety limit reached for ${categoryId}`);
          break;
        }
      }

      if (allProducts.length === 0) {
        setErrors(prev => ({
          ...prev,
          [categoryId]: `No products found for category: ${categoryId}`
        }));
        return;
      }

      migrationResult.totalProducts = allProducts.length;
      console.log(`Found ${allProducts.length} products for ${categoryId}, starting Firebase migration...`);

      // If force migration, delete existing products for this category
      if (force) {
        const productsRef = collection(db, 'products');
        const categoryQuery = query(productsRef, where('category', '==', categoryId));
        const existingProducts = await getDocs(categoryQuery);

        if (!existingProducts.empty) {
          console.log(`Deleting ${existingProducts.size} existing products for ${categoryId}`);
          const deleteBatch = writeBatch(db);
          existingProducts.docs.forEach(docRef => {
            deleteBatch.delete(docRef.ref);
          });
          await deleteBatch.commit();
        }
      }

      // Process products in batches
      const batchSize = 400;
      const productBatches = [];

      for (let i = 0; i < allProducts.length; i += batchSize) {
        productBatches.push(allProducts.slice(i, i + batchSize));
      }

      // Migrate each batch
      for (let batchIndex = 0; batchIndex < productBatches.length; batchIndex++) {
        const batch = writeBatch(db);
        const currentBatch = productBatches[batchIndex];

        for (let j = 0; j < currentBatch.length; j++) {
          try {
            const rawProduct = currentBatch[j];
            const globalIndex = (batchIndex * batchSize) + j;

            const product = mapNewProductToProduct(rawProduct, globalIndex);
            const productId = `${categoryId}_${product.id || globalIndex}`;

            // Clean up undefined values for Firestore
            const cleanProduct = {
              ...product,
              id: productId,
              category: categoryId,
              subCategory: product.subCategory || null,
              discountPrice: product.discountPrice || null,
              createdAt: new Date(),
              updatedAt: new Date(),
              migratedFrom: 'google_sheets',
              originalSheetName: categoryId
            };

            // Remove any remaining undefined values
            Object.keys(cleanProduct).forEach(key => {
              if (cleanProduct[key as keyof typeof cleanProduct] === undefined) {
                delete cleanProduct[key as keyof typeof cleanProduct];
              }
            });

            const productRef = doc(db, 'products', productId);
            batch.set(productRef, cleanProduct);
            migrationResult.migratedProducts++;

          } catch (productError) {
            const error = `Error processing product ${j}: ${productError instanceof Error ? productError.message : 'Unknown error'}`;
            migrationResult.errors.push(error);
          }
        }

        // Commit the batch
        if (currentBatch.length > 0) {
          await batch.commit();
          console.log(`Committed batch ${batchIndex + 1}/${productBatches.length} for ${categoryId}`);
        }
      }

      migrationResult.success = migrationResult.migratedProducts > 0;
      migrationResult.message = migrationResult.success
        ? `Successfully migrated ${migrationResult.migratedProducts} products for "${categoryId}"`
        : `Failed to migrate category "${categoryId}"`;

      setResults(prev => ({ ...prev, [categoryId]: migrationResult }));

      if (migrationResult.success) {
        // Refresh status after successful migration
        await checkCategoryStatus(categoryId);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Migration failed';
      setErrors(prev => ({ ...prev, [categoryId]: errorMessage }));
      migrationResult.errors.push(errorMessage);
    } finally {
      setMigrating(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Load all statuses on component mount
  useEffect(() => {
    categories.forEach(category => {
      checkCategoryStatus(category.id);
    });
  }, []);

  // Don't show if user is not authenticated
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in as admin to use the migration tools.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Client-Side Category Migration
            </CardTitle>
            <CardDescription>
              Migrate each product category individually with proper authentication
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => categories.forEach(cat => checkCategoryStatus(cat.id))}
            disabled={Object.values(loading).some(l => l)}
          >
            {Object.values(loading).some(l => l) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const categoryId = category.id;
            const status = categoryStatuses[categoryId];
            const isLoading = loading[categoryId];
            const isMigrating = migrating[categoryId];
            const result = results[categoryId];
            const error = errors[categoryId];

            return (
              <Card key={categoryId} className="border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* <span className="text-lg">{category.icon}</span> */}
                        <div>
                          <h3 className="font-medium">{category.name}</h3>

                        </div>
                      </div>

                      {/* {status && (
                        <Badge variant={status.exists ? "default" : "secondary"}>
                          {status.exists ? `${status.productCount} migrated` : "Not migrated"}
                        </Badge>
                      )} */}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {!status?.exists ? (
                        <Button
                          onClick={() => migrateCategory(categoryId, false)}
                          disabled={isMigrating || isLoading}
                          size="sm"
                          className="w-full"
                        >
                          {isMigrating ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Migrating...
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-2" />
                              Migrate {category.name}
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-1">
                          <Button
                            onClick={() => migrateCategory(categoryId, true)}
                            disabled={isMigrating || isLoading}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {isMigrating ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Re-migrating...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3 mr-2" />
                                Re-migrate (Force)
                              </>
                            )}
                          </Button>
                          {/* <p className="text-xs text-muted-foreground text-center">
                            Force will overwrite existing data
                          </p> */}
                        </div>
                      )}
                    </div>

                    {/* Results */}
                    {result && (
                      <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        <div className="flex items-start gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                          )}
                          <div className="space-y-1 flex-1">
                            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                              {result.message}
                            </AlertDescription>

                            {result.success && (
                              <div className="text-xs">
                                ✓ Migrated {result.migratedProducts} of {result.totalProducts} products
                              </div>
                            )}

                            {result.errors && result.errors.length > 0 && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground">
                                  View Issues ({result.errors.length})
                                </summary>
                                <div className="mt-1 space-y-1">
                                  {result.errors.slice(0, 3).map((error, index) => (
                                    <div key={index} className="text-muted-foreground">• {error}</div>
                                  ))}
                                  {result.errors.length > 3 && (
                                    <div className="text-muted-foreground">... and {result.errors.length - 3} more</div>
                                  )}
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                      </Alert>
                    )}

                    {/* Errors */}
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Checking status...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}