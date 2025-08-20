"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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

interface MigrationStatus {
  migrationExists: boolean;
  totalProducts: number;
  categories: Record<string, number>;
}

interface MigrationResult {
  success: boolean;
  totalCategories: number;
  migratedCategories: number;
  totalProducts: number;
  migratedProducts: number;
  errors: string[];
  categories: Record<string, { count: number; errors: string[] }>;
  message?: string;
}

export default function ProductMigration() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState<string>('');

  // Check current migration status
  const checkStatus = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/migrate-products');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
      } else {
        setError(data.error || 'Failed to check migration status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  // Debug sheets connection
  const debugSheets = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/debug-sheets', {
        method: 'POST',
      });
      
      const data = await response.json();
      console.log('Debug sheets result:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Debug failed');
    } finally {
      setLoading(false);
    }
  };

  // Run migration
  const runMigration = async (force = false) => {
    setMigrating(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/migrate-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force }),
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Refresh status after successful migration
        await checkStatus();
      } else if (!data.error?.includes('already exist')) {
        setError(data.error || 'Migration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  // Load status on component mount
  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Product Data Migration
            </CardTitle>
            <CardDescription>
              Migrate product data from Google Sheets to Firebase
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkStatus}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        {status && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Migration Status:</span>
              <Badge variant={status.migrationExists ? "default" : "secondary"}>
                {status.migrationExists ? "Migrated" : "Not Migrated"}
              </Badge>
            </div>
            
            {status.migrationExists && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">Total Products:</span>
                    <span className="font-medium">{status.totalProducts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Categories:</span>
                    <span className="font-medium">{Object.keys(status.categories).length}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Products by Category:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(status.categories).map(([category, count]) => (
                      <div key={category} className="flex justify-between p-2 bg-muted rounded">
                        <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Migration Actions */}
        <div className="space-y-3">
          {/* Debug Button */}
          <Button 
            onClick={debugSheets}
            disabled={loading || migrating}
            variant="secondary"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Sheets...
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Debug Sheets Connection
              </>
            )}
          </Button>

          {!status?.migrationExists ? (
            <Button 
              onClick={() => runMigration(false)}
              disabled={migrating}
              className="w-full"
            >
              {migrating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Migrating Products...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Start Migration
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={() => runMigration(true)}
                disabled={migrating}
                variant="outline"
                className="w-full"
              >
                {migrating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Re-migrating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-run Migration (Force)
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Force migration will overwrite existing product data
              </p>
            </div>
          )}
        </div>

        {/* Migration Progress/Result */}
        {migrating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Migration in progress...</span>
            </div>
            <Progress value={33} className="h-2" />
            <p className="text-xs text-muted-foreground">
              This may take a few minutes depending on the amount of data
            </p>
          </div>
        )}

        {/* Migration Result */}
        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message || (result.success ? 'Migration completed successfully!' : 'Migration failed')}
                </AlertDescription>
                
                {result.success && (
                  <div className="text-xs space-y-1">
                    <div>✓ Migrated {result.migratedProducts} products from {result.migratedCategories} categories</div>
                    {result.errors.length > 0 && (
                      <div className="text-yellow-700">⚠ {result.errors.length} warnings occurred</div>
                    )}
                  </div>
                )}
                
                {result.errors.length > 0 && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">
                      View Details ({result.errors.length} issues)
                    </summary>
                    <div className="mt-2 space-y-1 text-xs">
                      {result.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-muted-foreground">• {error}</div>
                      ))}
                      {result.errors.length > 5 && (
                        <div className="text-muted-foreground">... and {result.errors.length - 5} more</div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}