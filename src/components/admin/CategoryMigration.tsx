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
  RefreshCw,
  Package,
  TrendingUp
} from 'lucide-react';
import { categories } from '@/data/products';

interface CategoryStatus {
  category: string;
  exists: boolean;
  productCount: number;
  sampleProducts: Array<{
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }>;
  availableInSheets?: number; // Actual count from Google Sheets
}

interface CategoryMigrationResult {
  success: boolean;
  category: string;
  totalProducts: number;
  migratedProducts: number;
  errors: string[];
  message?: string;
  pages?: Array<{
    page: number;
    hasData: boolean;
    dataLength: number;
    totalPages?: number;
  }>;
}

export default function CategoryMigration() {
  const [categoryStatuses, setCategoryStatuses] = useState<Record<string, CategoryStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [migrating, setMigrating] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, CategoryMigrationResult>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check status for all categories
  const checkAllStatuses = async () => {
    setLoading(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    for (const category of categories) {
      try {
        const response = await fetch(`/api/migrate-category?category=${category.id}`);
        const data = await response.json();
        
        if (data.success) {
          setCategoryStatuses(prev => ({
            ...prev,
            [category.id]: data
          }));
        }
      } catch (err) {
        console.error(`Error checking status for ${category.id}:`, err);
      } finally {
        setLoading(prev => ({ ...prev, [category.id]: false }));
      }
    }
  };

  // Get actual count from Google Sheets
  const getActualCountFromSheets = async (categoryId: string): Promise<number> => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwT0TdiN9b9pa7ihupog_ztKDe9C3KK2BvGef4X_Zpy1W-pRJf7vupnqAXQB8cQuw-W/exec?page=1&limit=1&sheet=${categoryId}`
      );
      const data = await response.json();
      
      // The API should return total count even with limit=1
      if (data && typeof data.total === 'number') {
        return data.total;
      }
      return 0;
    } catch (error) {
      console.error(`Error fetching count for ${categoryId}:`, error);
      return 0;
    }
  };

  // Check status for single category
  const checkCategoryStatus = async (categoryId: string) => {
    setLoading(prev => ({ ...prev, [categoryId]: true }));
    
    try {
      // Get Firebase status
      const response = await fetch(`/api/migrate-category?category=${categoryId}`);
      const data = await response.json();
      
      // Get actual count from Google Sheets
      const actualCount = await getActualCountFromSheets(categoryId);
      
      if (data.success) {
        setCategoryStatuses(prev => ({
          ...prev,
          [categoryId]: {
            ...data,
            availableInSheets: actualCount
          }
        }));
      } else {
        setErrors(prev => ({ ...prev, [categoryId]: data.error || 'Failed to check status' }));
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        [categoryId]: err instanceof Error ? err.message : 'Failed to check status' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Migrate single category
  const migrateCategory = async (categoryId: string, force = false) => {
    setMigrating(prev => ({ ...prev, [categoryId]: true }));
    setErrors(prev => ({ ...prev, [categoryId]: '' }));
    setResults(prev => ({ ...prev, [categoryId]: {} as CategoryMigrationResult }));
    
    try {
      const response = await fetch('/api/migrate-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: categoryId, force }),
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [categoryId]: data }));
      
      if (data.success) {
        // Refresh status after successful migration
        await checkCategoryStatus(categoryId);
      } else if (!data.error?.includes('already exist')) {
        setErrors(prev => ({ ...prev, [categoryId]: data.error || 'Migration failed' }));
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        [categoryId]: err instanceof Error ? err.message : 'Migration failed' 
      }));
    } finally {
      setMigrating(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Load all statuses on component mount
  useEffect(() => {
    checkAllStatuses();
  }, []);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📦';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Category-by-Category Migration
            </CardTitle>
            <CardDescription>
              Migrate each product category individually from Google Sheets to Firebase
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkAllStatuses}
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
                        <span className="text-lg">{getCategoryIcon(categoryId)}</span>
                        <div>
                          <h3 className="font-medium">{getCategoryName(categoryId)}</h3>
                          <p className="text-xs text-muted-foreground">
                            {status?.availableInSheets !== undefined 
                              ? `${status.availableInSheets} available in sheets`
                              : `${category.itemCount} expected items`
                            }
                          </p>
                        </div>
                      </div>
                      
                      {status && (
                        <Badge variant={status.exists ? "default" : "secondary"}>
                          {status.exists ? `${status.productCount} migrated` : "Not migrated"}
                        </Badge>
                      )}
                    </div>

                    {/* Status Info */}
                    {status && status.exists && (
                      <div className="text-xs text-muted-foreground">
                        <p>Sample products: {status.sampleProducts.map(p => p.name).join(', ').slice(0, 50)}...</p>
                      </div>
                    )}

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
                              Migrate {getCategoryName(categoryId)}
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
                          <p className="text-xs text-muted-foreground text-center">
                            Force will overwrite existing data
                          </p>
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