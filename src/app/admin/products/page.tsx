"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  AlertCircle,
  CheckCircle,
  X,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { Product, categories } from '@/data/products';
import { useSettings } from '@/contexts/SettingsContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductEditor from '@/components/ProductEditor';
import { updateDocument } from '@/app/actions/updateDocument';
import { deleteDocument } from '@/app/actions/deleteDocument';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (!db) {
          throw new Error('Database not initialized');
        }

        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        setProducts(productsData);
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products from Firebase. Make sure to run migration first.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and filters
  const filterProducts = useCallback(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'in-stock' && product.inStock) ||
        (statusFilter === 'out-of-stock' && !product.inStock);

      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // Add escape key handler to close dialogs
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCreateDialog(false);
        setShowEditDialog(false);
        setShowPreviewDialog(false);
        setSelectedProduct(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Get unique categories
  const productCategories = Array.from(new Set(products.map(p => p.category)));

  // Cleanup function to reset all dialog states
  const resetDialogStates = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowPreviewDialog(false);
    setSelectedProduct(null);
  };

  // Handler functions
  const handleCreateProduct = () => {
    resetDialogStates();
    setTimeout(() => {
      setShowCreateDialog(true);
    }, 10);
  };

  const handleProductCreated = () => {
    resetDialogStates();
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedProduct(product);
      setShowEditDialog(true);
    }, 10);
  };

  const handleProductUpdated = () => {
    resetDialogStates();
    fetchProducts();
  };

  const handlePreviewProduct = (product: Product) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedProduct(product);
      setShowPreviewDialog(true);
    }, 10);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      const result = await deleteDocument("products", productId, "/admin/products");
      if ("success" in result && result.success) {
        setProducts(products.filter(product => product.id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error("message" in result ? result.message : "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updatedProduct = { ...product, featured: !product.featured };
      const result = await updateDocument("products", product.id, { featured: !product.featured }, "/admin/products");
      
      if ("success" in result && result.success) {
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
        toast.success(updatedProduct.featured ? "Product added to featured" : "Product removed from featured");
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Failed to update product");
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const updatedProduct = { ...product, inStock: !product.inStock };
      const result = await updateDocument("products", product.id, { inStock: !product.inStock }, "/admin/products");
      
      if ("success" in result && result.success) {
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
        toast.success(updatedProduct.inStock ? "Product marked as in stock" : "Product marked as out of stock");
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Failed to update product");
    }
  };

  // Refetch products function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        throw new Error('Database not initialized');
      }

      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setProducts(productsData);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products from Firebase. Make sure to run migration first.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: settings?.currency || 'NGN',
    }).format(amount);
  };

  const getStockStatus = (inStock: boolean) => {
    return inStock ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        In Stock
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <X className="h-3 w-3 mr-1" />
        Out of Stock
      </Badge>
    );
  };

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Failed to Load Products</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Go to Migration</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inStockProducts}</p>
                <p className="text-sm text-gray-600">In Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{outOfStockProducts}</p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(averagePrice)}</p>
                <p className="text-sm text-gray-600">Average Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog and inventory</CardDescription>
            </div>
            <Button onClick={handleCreateProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name, category, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value: 'all' | 'in-stock' | 'out-of-stock') => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first product to get started'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover border"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>Category: {product.category}</span>
                              <span>•</span>
                              <span>Vendor: {product.vendor.name}</span>
                              <span>•</span>
                              <span>Weight: {product.weight}kg</span>
                            </div>

                            <div className="flex items-center space-x-4 mb-2">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(product.discountPrice || product.price)}
                              </div>
                              {product.discountPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </div>
                              )}
                              {getStockStatus(product.inStock)}
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>⭐ {product.rating} ({product.reviewCount} reviews)</span>
                              {product.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              {product.bestSeller && (
                                <Badge variant="secondary">Best Seller</Badge>
                              )}
                              {product.new && (
                                <Badge variant="secondary">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePreviewProduct(product)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                          <Star className="h-4 w-4 mr-2" />
                          {product.featured ? 'Remove from Featured' : 'Add to Featured'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStock(product)}>
                          {product.inStock ? (
                            <X className="h-4 w-4 mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => product.id && handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ProductEditor onClose={handleProductCreated} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedProduct && (
              <ProductEditor 
                key={selectedProduct.id}
                update={true} 
                product={selectedProduct} 
                onClose={handleProductUpdated} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Product Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
            <DialogDescription>
              Preview how your product will look to customers
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedProduct && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {selectedProduct.featured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {selectedProduct.new && (
                        <Badge className="bg-green-500">New</Badge>
                      )}
                      {selectedProduct.bestSeller && (
                        <Badge className="bg-blue-500">Best Seller</Badge>
                      )}
                    </div>
                    {!selectedProduct.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {selectedProduct.name}
                      </h1>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < selectedProduct.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedProduct.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedProduct.discountPrice || selectedProduct.price)}
                      </span>
                      {selectedProduct.discountPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(selectedProduct.price)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <span className="ml-2 font-medium">{selectedProduct.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Vendor:</span>
                        <span className="ml-2 font-medium">{selectedProduct.vendor.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium">{selectedProduct.weight}kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium">{selectedProduct.location || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{selectedProduct.description}</p>
                    </div>

                    {selectedProduct.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Features</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="text-gray-700">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Object.keys(selectedProduct.specifications).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                              <div key={key} className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedProduct.images.length > 1 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Additional Images</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedProduct.images.slice(1).map((image, index) => (
                            <div key={index} className="relative h-20 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={image}
                                alt={`${selectedProduct.name} ${index + 2}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}