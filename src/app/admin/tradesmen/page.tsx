"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Hammer,
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
import { Tradesman } from '@/types/tradesman';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TradesmanEditor from '@/components/TradesmanEditor';
import { updateDocument } from '@/app/actions/updateDocument';
import { deleteDocument } from '@/app/actions/deleteDocument';
import { toast } from 'sonner';

export default function AdminTradesmenPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [tradesmen, setTradesmen] = useState<Tradesman[]>([]);
  const [filteredTradesmen, setFilteredTradesmen] = useState<Tradesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedTradesman, setSelectedTradesman] = useState<Tradesman | null>(null);

  // Fetch tradesmen from Firebase
  const fetchTradesmen = async () => {
    try {
      setLoading(true);
      const tradesmenRef = collection(db, 'tradesmen');
      const q = query(tradesmenRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const tradesmenData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tradesman[];

      setTradesmen(tradesmenData);
      setError('');
    } catch (err) {
      console.error('Error fetching tradesmen:', err);
      setError('Failed to fetch tradesmen from Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradesmen();
  }, []);

  // Filter tradesmen based on search and filters
  const filterTradesmen = useCallback(() => {
    const filtered = tradesmen.filter(tradesman => {
      const matchesSearch = tradesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tradesman.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tradesman.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tradesman.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || tradesman.status === statusFilter;
      const matchesTrade = tradeFilter === 'all' || tradesman.trade === tradeFilter;

      return matchesSearch && matchesStatus && matchesTrade;
    });
    setFilteredTradesmen(filtered);
  }, [tradesmen, searchTerm, statusFilter, tradeFilter]);

  useEffect(() => {
    filterTradesmen();
  }, [filterTradesmen]);

  // Get unique trades
  const uniqueTrades = Array.from(new Set(tradesmen.map(t => t.trade)));

  // Cleanup function to reset all dialog states
  const resetDialogStates = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowPreviewDialog(false);
    setSelectedTradesman(null);
  };

  // Handler functions
  const handleCreateTradesman = () => {
    resetDialogStates();
    setTimeout(() => {
      setShowCreateDialog(true);
    }, 10);
  };

  const handleTradesmanCreated = () => {
    resetDialogStates();
    fetchTradesmen();
  };

  const handleEditTradesman = (tradesman: Tradesman) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedTradesman(tradesman);
      setShowEditDialog(true);
    }, 10);
  };

  const handleTradesmanUpdated = () => {
    resetDialogStates();
    fetchTradesmen();
  };

  const handlePreviewTradesman = (tradesman: Tradesman) => {
    resetDialogStates();
    setTimeout(() => {
      setSelectedTradesman(tradesman);
      setShowPreviewDialog(true);
    }, 10);
  };

  const handleDeleteTradesman = async (tradesmanId: string) => {
    if (!confirm('Are you sure you want to delete this tradesman? This action cannot be undone.')) {
      return;
    }
    
    try {
      const result = await deleteDocument("tradesmen", tradesmanId, "/admin/tradesmen");
      if ("success" in result && result.success) {
        setTradesmen(tradesmen.filter(tradesman => tradesman.id !== tradesmanId));
        toast.success("Tradesman deleted successfully");
      } else {
        toast.error("message" in result ? result.message : "Failed to delete tradesman");
      }
    } catch (error) {
      console.error('Error deleting tradesman:', error);
      toast.error("Failed to delete tradesman");
    }
  };

  const handleToggleFeatured = async (tradesman: Tradesman) => {
    try {
      const updatedTradesman = { ...tradesman, featured: !tradesman.featured };
      const result = await updateDocument("tradesmen", tradesman.id, { featured: !tradesman.featured }, "/admin/tradesmen");
      
      if ("success" in result && result.success) {
        setTradesmen(tradesmen.map(t => t.id === tradesman.id ? updatedTradesman : t));
        toast.success(updatedTradesman.featured ? "Tradesman added to featured" : "Tradesman removed from featured");
      } else {
        toast.error("Failed to update tradesman");
      }
    } catch (error) {
      console.error('Error updating tradesman:', error);
      toast.error("Failed to update tradesman");
    }
  };

  const handleUpdateStatus = async (tradesman: Tradesman, status: 'approved' | 'rejected' | 'suspended') => {
    try {
      const updatedTradesman = { ...tradesman, status };
      const result = await updateDocument("tradesmen", tradesman.id, { status }, "/admin/tradesmen");
      
      if ("success" in result && result.success) {
        setTradesmen(tradesmen.map(t => t.id === tradesman.id ? updatedTradesman : t));
        toast.success(`Tradesman ${status} successfully`);
      } else {
        toast.error("Failed to update tradesman status");
      }
    } catch (error) {
      console.error('Error updating tradesman status:', error);
      toast.error("Failed to update tradesman status");
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const totalTradesmen = tradesmen.length;
  const approvedTradesmen = tradesmen.filter(t => t.status === 'approved').length;
  const pendingTradesmen = tradesmen.filter(t => t.status === 'pending').length;
  const featuredTradesmen = tradesmen.filter(t => t.featured).length;

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
            <h3 className="font-medium">Failed to Load Tradesmen</h3>
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
                <Hammer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTradesmen}</p>
                <p className="text-sm text-gray-600">Total Tradesmen</p>
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
                <p className="text-2xl font-bold">{approvedTradesmen}</p>
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
                <p className="text-2xl font-bold">{pendingTradesmen}</p>
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
                <p className="text-2xl font-bold">{featuredTradesmen}</p>
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
              <CardTitle>Tradesman Management</CardTitle>
              <CardDescription>Manage tradesman registrations and profiles</CardDescription>
            </div>
            <Button onClick={handleCreateTradesman}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tradesman
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tradesmen by name, trade, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={tradeFilter} onValueChange={setTradeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by trade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  {uniqueTrades.map(trade => (
                    <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
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

      {/* Tradesmen List */}
      <Card>
        <CardContent className="p-0">
          {filteredTradesmen.length === 0 ? (
            <div className="text-center py-12">
              <Hammer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tradesmen found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || tradeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first tradesman to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && tradeFilter === 'all' && (
                <Button onClick={handleCreateTradesman}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Tradesman
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTradesmen.map((tradesman) => (
                <div key={tradesman.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {tradesman.profileImage ? (
                          <Image
                            src={tradesman.profileImage}
                            alt={tradesman.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover border h-[5rem]"
                            unoptimized
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border">
                            <Hammer className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {tradesman.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>Trade: {tradesman.trade}</span>
                              <span>•</span>
                              <span>Experience: {tradesman.yearsOfExperience} years</span>
                              <span>•</span>
                              <span>Rate: ₦{tradesman.hourlyRate || 0}/hr</span>
                            </div>

                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < tradesman.rating ? 'fill-current' : ''}`} />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">({tradesman.reviewCount} reviews)</span>
                              </div>
                              <Badge className={getStatusColor(tradesman.status)}>
                                {tradesman.status.charAt(0).toUpperCase() + tradesman.status.slice(1)}
                              </Badge>
                              <Badge className={getAvailabilityColor(tradesman.availability)}>
                                {tradesman.availability.charAt(0).toUpperCase() + tradesman.availability.slice(1)}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                              <span>📍 {tradesman.location}</span>
                              {tradesman.emergencyAvailable && (
                                <Badge variant="outline">Emergency Available</Badge>
                              )}
                              {tradesman.featured && (
                                <Badge variant="secondary">Featured</Badge>
                              )}
                              {tradesman.verified && (
                                <Badge variant="secondary">Verified</Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {tradesman.skills.slice(0, 4).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {tradesman.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tradesman.skills.length - 4} more
                                </Badge>
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
                        <DropdownMenuItem onClick={() => handlePreviewTradesman(tradesman)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Tradesman
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTradesman(tradesman)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Tradesman
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleFeatured(tradesman)}>
                          <Star className="h-4 w-4 mr-2" />
                          {tradesman.featured ? 'Remove from Featured' : 'Add to Featured'}
                        </DropdownMenuItem>
                        {tradesman.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(tradesman, 'approved')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Approve Tradesman
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(tradesman, 'rejected')}>
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Reject Tradesman
                            </DropdownMenuItem>
                          </>
                        )}
                        {tradesman.status === 'approved' && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(tradesman, 'suspended')}>
                            <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                            Suspend Tradesman
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => tradesman.id && handleDeleteTradesman(tradesman.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Tradesman
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

      {/* Create Tradesman Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setSelectedTradesman(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Tradesman</DialogTitle>
            <DialogDescription>
              Add a new tradesman to your platform
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <TradesmanEditor onClose={handleTradesmanCreated} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tradesman Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        setShowEditDialog(open);
        if (!open) {
          setSelectedTradesman(null);
        }
      }}>
        <DialogContent className="max-w-6xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Tradesman</DialogTitle>
            <DialogDescription>
              Make changes to tradesman profile
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedTradesman && (
              <TradesmanEditor 
                key={selectedTradesman.id}
                update={true} 
                tradesman={selectedTradesman} 
                onClose={handleTradesmanUpdated} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Tradesman Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={(open) => {
        setShowPreviewDialog(open);
        if (!open) {
          setSelectedTradesman(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Tradesman Profile</DialogTitle>
            <DialogDescription>
              Complete tradesman profile information
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTradesman && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="relative h-64 overflow-hidden rounded-t-lg bg-gradient-to-r from-orange-500 to-red-600">
                    {selectedTradesman.profileImage ? (
                      <Image
                        src={selectedTradesman.profileImage}
                        alt={selectedTradesman.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Hammer className="h-24 w-24 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {selectedTradesman.featured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {selectedTradesman.verified && (
                        <Badge className="bg-green-500">Verified</Badge>
                      )}
                      {selectedTradesman.emergencyAvailable && (
                        <Badge className="bg-blue-500">Emergency Available</Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className={getStatusColor(selectedTradesman.status)}>
                        {selectedTradesman.status.charAt(0).toUpperCase() + selectedTradesman.status.slice(1)}
                      </Badge>
                      <Badge className={getAvailabilityColor(selectedTradesman.availability)}>
                        {selectedTradesman.availability.charAt(0).toUpperCase() + selectedTradesman.availability.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedTradesman.name}
                      </h1>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < selectedTradesman.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedTradesman.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                      <div>
                        <span className="text-gray-500">Trade:</span>
                        <span className="ml-2 font-medium">{selectedTradesman.trade}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <span className="ml-2 font-medium">{selectedTradesman.yearsOfExperience} years</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hourly Rate:</span>
                        <span className="ml-2 font-medium">₦{selectedTradesman.hourlyRate || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Project Rate:</span>
                        <span className="ml-2 font-medium">₦{selectedTradesman.projectRate || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Travel Distance:</span>
                        <span className="ml-2 font-medium">{selectedTradesman.travelDistance}km</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium">{selectedTradesman.location}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Contact:</span>
                        <span className="ml-2 font-medium">{selectedTradesman.email} • {selectedTradesman.phone}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-700">{selectedTradesman.description}</p>
                    </div>

                    {selectedTradesman.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTradesman.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTradesman.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTradesman.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTradesman.workImages && selectedTradesman.workImages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Work Portfolio</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedTradesman.workImages.map((image, index) => (
                            <div key={index} className="relative h-24 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={image}
                                alt={`${selectedTradesman.name} work ${index + 1}`}
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