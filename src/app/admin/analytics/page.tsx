"use client";

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import { useSettings } from '@/contexts/SettingsContext';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topCategories: { category: string; count: number; revenue: number }[];
  monthlyData: { month: string; revenue: number; orders: number }[];
  recentActivity: { type: string; description: string; date: Date }[];
}

export default function AdminAnalyticsPage() {
  const { settings } = useSettings();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      console.log('Fetching analytics data for range:', { timeRange, startDate, now });

      let orders: Order[] = [];
      let allOrders: Order[] = [];
      let totalUsers = 0;

      try {
        // Fetch all orders first (simpler query)
        const ordersRef = collection(db, 'orders');
        const allOrdersQuery = query(ordersRef, orderBy('orderDate', 'desc'));
        const allOrdersSnapshot = await getDocs(allOrdersQuery);
        
        allOrders = allOrdersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            orderDate: data.orderDate?.toDate() || new Date(),
          };
        }) as Order[];

        console.log('Fetched all orders:', allOrders.length);

        // Filter orders by date range in memory (more reliable than Firestore query)
        orders = allOrders.filter(order => order.orderDate >= startDate);

        console.log('Filtered orders for time range:', orders.length);
      } catch (ordersError) {
        console.error('Error fetching orders:', ordersError);
        // Continue with empty arrays
      }

      try {
        // Fetch users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        totalUsers = usersSnapshot.size;
        console.log('Fetched users:', totalUsers);
      } catch (usersError) {
        console.error('Error fetching users:', usersError);
        // Continue with 0 users
      }

      // Calculate metrics with safe defaults
      const completedOrders = orders.filter(order => order.status !== 'cancelled');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (comparing with previous period)
      const previousPeriodStart = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      const previousOrders = allOrders.filter(order => 
        order.orderDate >= previousPeriodStart && order.orderDate < startDate
      );
      const previousRevenue = previousOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const previousOrderCount = previousOrders.length;

      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 
                           totalRevenue > 0 ? 100 : 0;
      const ordersGrowth = previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 
                          totalOrders > 0 ? 100 : 0;

      // Calculate top categories with safe defaults
      const categoryMap: { [key: string]: { count: number; revenue: number } } = {};
      completedOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const category = item.category || 'Other';
            if (!categoryMap[category]) {
              categoryMap[category] = { count: 0, revenue: 0 };
            }
            categoryMap[category].count += item.quantity || 0;
            categoryMap[category].revenue += (item.price || 0) * (item.quantity || 0);
          });
        }
      });

      const topCategories = Object.entries(categoryMap)
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Keep topCategories empty if no real data exists

      // Generate monthly data with safe defaults
      const monthlyMap: { [key: string]: { revenue: number; orders: number } } = {};
      completedOrders.forEach(order => {
        try {
          const monthKey = order.orderDate.toISOString().substring(0, 7); // YYYY-MM
          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { revenue: 0, orders: 0 };
          }
          monthlyMap[monthKey].revenue += order.totalAmount || 0;
          monthlyMap[monthKey].orders += 1;
        } catch (e) {
          console.warn('Error processing monthly data for order:', order.id);
        }
      });

      const monthlyData = Object.entries(monthlyMap)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      // Keep monthlyData empty if no real data exists

      // Recent activity with safe defaults
      const recentActivity = orders.slice(0, 10).map(order => ({
        type: 'order',
        description: `Order #${order.orderNumber || order.id} - ${formatCurrency(order.totalAmount || 0)}`,
        date: order.orderDate,
      }));

      console.log('Analytics data calculated:', {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        topCategoriesCount: topCategories.length,
        monthlyDataCount: monthlyData.length,
        recentActivityCount: recentActivity.length
      });

      setAnalyticsData({
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        topCategories,
        monthlyData,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      
      // Set empty analytics data in case of error
      setAnalyticsData({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        topCategories: [],
        monthlyData: [],
        recentActivity: [],
      });
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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your business performance and growth</p>
        </div>
        <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analyticsData.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analyticsData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(analyticsData.revenueGrowth)}
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analyticsData.ordersGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analyticsData.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(analyticsData.ordersGrowth)}
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per completed order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Best performing product categories by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.topCategories.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No category data yet</p>
                <p className="text-sm text-gray-400">Categories will appear here when orders are placed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-gray-500">{category.count} items sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Revenue and order trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.monthlyData.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No monthly data yet</p>
                <p className="text-sm text-gray-400">Monthly trends will appear here when orders are placed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{month.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(month.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest orders and system activity</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No recent activity</p>
                <p className="text-sm text-gray-400">Recent orders and activities will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Order</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}