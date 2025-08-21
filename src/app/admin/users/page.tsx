import React, { Suspense } from 'react';
import { getCollection, isFirebaseError } from '@/lib/firebase-utils';
import { UserProfile } from '@/types/user';
import { Order } from '@/types/order';
import UsersClient from './UsersClient';

interface UserWithStats extends UserProfile {
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: Date;
}

async function fetchUsersData(): Promise<UserWithStats[]> {
  try {
    // Fetch users
    const usersResult = await getCollection<UserProfile>('users', {
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });

    if (isFirebaseError(usersResult)) {
      console.error('Error fetching users:', usersResult.error);
      return [];
    }

    // Fetch orders to calculate user stats
    const ordersResult = await getCollection<Order>('orders');
    
    if (isFirebaseError(ordersResult)) {
      console.error('Error fetching orders:', ordersResult.error);
      return usersResult.data.map(user => ({ ...user, orderCount: 0, totalSpent: 0 }));
    }

    const users = usersResult.data;
    const orders = ordersResult.data;

    // Calculate stats for each user
    const usersWithStats = users.map(user => {
      const userOrders = orders.filter(order => order.userId === user.uid);
      const totalSpent = userOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const lastOrder = userOrders
        .sort((a, b) => {
          const dateA = a.orderDate instanceof Date ? a.orderDate : new Date(a.orderDate);
          const dateB = b.orderDate instanceof Date ? b.orderDate : new Date(b.orderDate);
          return dateB.getTime() - dateA.getTime();
        })[0];

      return {
        ...user,
        orderCount: userOrders.length,
        totalSpent,
        lastOrderDate: lastOrder ? (lastOrder.orderDate instanceof Date ? lastOrder.orderDate : new Date(lastOrder.orderDate)) : undefined,
      };
    });

    return usersWithStats;
  } catch (error) {
    console.error('Error fetching users data:', error);
    return [];
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminUsersPage() {
  const users = await fetchUsersData();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UsersClient users={users} />
    </Suspense>
  );
}