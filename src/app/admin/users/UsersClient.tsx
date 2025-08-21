"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
  MoreHorizontal,
  Mail,
  Calendar,
  MapPin,
  ShoppingBag,
  Ban,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';
import { toJSDate } from '@/lib/formatOrderDate';

interface UserWithStats extends UserProfile {
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: Date;
}

interface UsersClientProps {
  users: UserWithStats[];
}

export default function UsersClient({ users }: UsersClientProps) {
  const [filteredUsers, setFilteredUsers] = useState<UserWithStats[]>(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const handleViewUser = (user: UserWithStats) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(user => (user.orderCount || 0) > 0).length;
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Monitor and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here when they register'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.uid} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium">{user.name || 'Unnamed User'}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {toJSDate(user.createdAt).toLocaleDateString()}
                          </span>
                          {user.addresses && user.addresses.length > 0 && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.addresses.length} address{user.addresses.length > 1 ? 'es' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{user.orderCount || 0} orders</p>
                        <p className="text-sm text-gray-500">
                          {user.totalSpent ? formatCurrency(user.totalSpent) : 'No purchases'}
                        </p>
                        {user.lastOrderDate && (
                          <p className="text-xs text-gray-400">
                            Last order: {user.lastOrderDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <Badge variant={user.orderCount && user.orderCount > 0 ? "default" : "secondary"}>
                        {user.orderCount && user.orderCount > 0 ? 'Active' : 'New'}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <UsersIcon className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
            <DialogDescription>
              Complete user information and activity history
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedUser.name || 'Not provided'}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedUser.phone || 'Not provided'}</p>
                    <p><span className="font-medium">Member since:</span> {toJSDate(selectedUser.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last updated:</span> {toJSDate(selectedUser.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Order Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Total Orders:</span> {selectedUser.orderCount || 0}</p>
                    <p><span className="font-medium">Total Spent:</span> {selectedUser.totalSpent ? formatCurrency(selectedUser.totalSpent) : 'N/A'}</p>
                    <p><span className="font-medium">Last Order:</span> {selectedUser.lastOrderDate?.toLocaleDateString() || 'Never'}</p>
                    <p><span className="font-medium">Customer Status:</span>
                      <Badge className={`ml-2 ${(selectedUser.orderCount || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {(selectedUser.orderCount || 0) > 0 ? 'Active' : 'New'}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Saved Addresses</h4>
                  <div className="space-y-3">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={address.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{address.name}</span>
                              <Badge variant={address.type === 'home' ? 'default' : 'secondary'}>
                                {address.type}
                              </Badge>
                              {address.isDefault && (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}