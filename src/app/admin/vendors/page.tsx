"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Store,
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
import { Vendor } from '@/types/vendor';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import VendorEditor from '@/components/VendorEditor';
import { updateDocument } from '@/app/actions/updateDocument';
import { deleteDocument } from '@/app/actions/deleteDocument';
import { toast } from 'sonner';

export default function AdminVendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Fetch vendors from Firebase
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const vendorsRef = collection(db, 'vendors');
      const q = query(vendorsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const vendorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];

      setVendors(vendorsData);
      setError('');
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to fetch vendors from Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filter vendors based on search and filters
  const filterVendors = useCallback(() => {
    const filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredVendors(filtered);
  }, [vendors, searchTerm, statusFilter]);

  useEffect(() => {
    filterVendors();
  }, [filterVendors]);

  // Cleanup function to reset all dialog states
  const resetDialogStates = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowPreviewDialog(false);
    setSelectedVendor(null);
  };

  // Handler functions
  const handleCreateVendor = () => {
    resetDialogStates();
    setTimeout(() => {
      setShowCreateDialog(true);
    }, 10);
  };

  const handleVendorCreated = () => {
    resetDialogStates();
    fetchVendors();
  };

  const handleEditVendor = (vendor: Vendor) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedVendor(vendor);
      setShowEditDialog(true);
    }, 10);
  };

  const handleVendorUpdated = () => {
    resetDialogStates();
    fetchVendors();
  };

  const handlePreviewVendor = (vendor: Vendor) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedVendor(vendor);
      setShowPreviewDialog(true);
    }, 10);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }
    
    try {
      const result = await deleteDocument("vendors", vendorId, "/admin/vendors");
      if ("success" in result && result.success) {
        setVendors(vendors.filter(vendor => vendor.id !== vendorId));
        toast.success("Vendor deleted successfully");
      } else {
        toast.error("message" in result ? result.message : "Failed to delete vendor");
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error("Failed to delete vendor");
    }
  };

  const handleToggleFeatured = async (vendor: Vendor) => {
    try {
      const updatedVendor = { ...vendor, featured: !vendor.featured };
      const result = await updateDocument("vendors", vendor.id, { featured: !vendor.featured }, "/admin/vendors");
      
      if ("success" in result && result.success) {
        setVendors(vendors.map(v => v.id === vendor.id ? updatedVendor : v));
        toast.success(updatedVendor.featured ? "Vendor added to featured" : "Vendor removed from featured");
      } else {
        toast.error("Failed to update vendor");
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.error("Failed to update vendor");
    }
  };

  const handleUpdateStatus = async (vendor: Vendor, status: 'approved' | 'rejected' | 'suspended') => {
    try {
      const updatedVendor = { ...vendor, status };
      const result = await updateDocument("vendors", vendor.id, { status }, "/admin/vendors");
      
      if ("success" in result && result.success) {
        setVendors(vendors.map(v => v.id === vendor.id ? updatedVendor : v));
        toast.success(`Vendor ${status} successfully`);
      } else {
        toast.error("Failed to update vendor status");
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast.error("Failed to update vendor status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const totalVendors = vendors.length;
  const approvedVendors = vendors.filter(v => v.status === 'approved').length;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const featuredVendors = vendors.filter(v => v.featured).length;

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
            <h3 className="font-medium">Failed to Load Vendors</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
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
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVendors}</p>
                <p className="text-sm text-gray-600">Total Vendors</p>
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
                <p className="text-2xl font-bold">{approvedVendors}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingVendors}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredVendors}</p>
                <p className="text-sm text-gray-600">Featured</p>
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
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>Manage vendor registrations and profiles</CardDescription>
            </div>
            <Button onClick={handleCreateVendor}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors by name, business, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors List */}
      <Card>
        <CardContent className="p-0">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first vendor to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleCreateVendor}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Vendor
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {vendor.profileImage ? (
                          <Image
                            src={vendor.profileImage}
                            alt={vendor.businessName}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover border"
                            unoptimized
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border">
                            <Store className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {vendor.businessName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>Owner: {vendor.name}</span>
                              <span>•</span>
                              <span>Type: {vendor.businessType}</span>
                              <span>•</span>
                              <span>Experience: {vendor.yearsOfExperience} years</span>
                            </div>

                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < vendor.rating ? 'fill-current' : ''}`} />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">({vendor.reviewCount} reviews)</span>
                              </div>
                              <Badge className={getStatusColor(vendor.status)}>
                                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>📍 {vendor.location}</span>
                              {vendor.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              {vendor.verified && (
                                <Badge variant="secondary">Verified</Badge>
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
                        <DropdownMenuItem onClick={() => handlePreviewVendor(vendor)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Vendor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditVendor(vendor)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Vendor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(vendor)}>
                          <Star className="h-4 w-4 mr-2" />
                          {vendor.featured ? 'Remove from Featured' : 'Add to Featured'}
                        </DropdownMenuItem>
                        {vendor.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(vendor, 'approved')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Approve Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(vendor, 'rejected')}>
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Reject Vendor
                            </DropdownMenuItem>
                          </>
                        )}
                        {vendor.status === 'approved' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(vendor, 'suspended')}>
                            <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                            Suspend Vendor
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => vendor.id && handleDeleteVendor(vendor.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Vendor
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

      {/* Create Vendor Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setSelectedVendor(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Vendor</DialogTitle>
            <DialogDescription>
              Add a new vendor to your platform
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <VendorEditor onClose={handleVendorCreated} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          setSelectedVendor(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Make changes to vendor profile
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedVendor && (
              <VendorEditor 
                key={selectedVendor.id}
                update={true} 
                vendor={selectedVendor} 
                onClose={handleVendorUpdated} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Vendor Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setSelectedVendor(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Vendor Profile</DialogTitle>
            <DialogDescription>
              Complete vendor profile information
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedVendor && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="relative h-64 overflow-hidden rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    {selectedVendor.profileImage ? (
                      <Image
                        src={selectedVendor.profileImage}
                        alt={selectedVendor.businessName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-24 w-24 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {selectedVendor.featured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {selectedVendor.verified && (
                        <Badge className="bg-green-500">Verified</Badge>
                      )}
                    </div>
                    <Badge className={`absolute top-4 right-4 ${getStatusColor(selectedVendor.status)}`}>
                      {selectedVendor.status.charAt(0).toUpperCase() + selectedVendor.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedVendor.businessName}
                      </h1>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < selectedVendor.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedVendor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                      <div>
                        <span className="text-gray-500">Owner:</span>
                        <span className="ml-2 font-medium">{selectedVendor.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Business Type:</span>
                        <span className="ml-2 font-medium">{selectedVendor.businessType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <span className="ml-2 font-medium">{selectedVendor.yearsOfExperience} years</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price Range:</span>
                        <span className="ml-2 font-medium capitalize">{selectedVendor.priceRange}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium">{selectedVendor.location}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Contact:</span>
                        <span className="ml-2 font-medium">{selectedVendor.email} • {selectedVendor.phone}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-700">{selectedVendor.description}</p>
                    </div>

                    {selectedVendor.services.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVendor.services.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedVendor.specializations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVendor.specializations.map((spec, index) => (
                            <Badge key={index} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedVendor.businessImages && selectedVendor.businessImages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Business Images</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedVendor.businessImages.map((image, index) => (
                            <div key={index} className="relative h-24 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={image}
                                alt={`${selectedVendor.businessName} ${index + 1}`}
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