import React, { Suspense } from 'react';
import { getCollection, getCollectionCount, isFirebaseError } from '@/lib/firebase-utils';
import { Order } from '@/types/order';
import OverviewClient from './overview/OverviewClient';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

async function fetchDashboardData(): Promise<{ stats: DashboardStats; recentOrders: Order[] }> {
  try {
    // Fetch orders
    const ordersResult = await getCollection<Order>('orders', {
      orderBy: [{ field: 'orderDate', direction: 'desc' }]
    });

    let orders: Order[] = [];
    if (!isFirebaseError(ordersResult)) {
      orders = ordersResult.data;
    }

    // Fetch users count
    const usersCountResult = await getCollectionCount('users');
    let totalUsers = 0;
    if (!isFirebaseError(usersCountResult)) {
      totalUsers = usersCountResult.data;
    }

    // Fetch products count
    const productsCountResult = await getCollectionCount('products');
    let totalProducts = 0;
    if (!isFirebaseError(productsCountResult)) {
      totalProducts = productsCountResult.data;
    }

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'processing'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => 
      order.status === 'delivered'
    ).length;
    const totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const stats: DashboardStats = {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalUsers,
      totalProducts
    };

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    return { stats, recentOrders };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0
      },
      recentOrders: []
    };
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const { stats, recentOrders } = await fetchDashboardData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <OverviewClient stats={stats} recentOrders={recentOrders} />
    </Suspense>
  );
}