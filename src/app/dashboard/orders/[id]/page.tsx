"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/firestore';
import { Order } from '@/types/order';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  X,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Download,
  User,
  Hash,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Timestamp } from 'firebase/firestore';
import { toJSDate } from '@/lib/formatOrderDate';

// Dynamically import DownloadableReceipt with SSR disabled
const DownloadableReceipt = dynamic(
  () => import("@/components/DownloadableReceipt"),
  { ssr: false }
);

export default function OrderDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;

      try {
        const orderData = await getOrderById(orderId);
        if (orderData) {
          // Verify the order belongs to the current user
          if (orderData.userId !== user.uid) {
            setError('Order not found or access denied');
            return;
          }
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your order is being reviewed';
      case 'confirmed':
        return 'Your order has been confirmed and will be processed soon';
      case 'processing':
        return 'Your order is being prepared for shipment';
      case 'shipped':
        return 'Your order is on its way to the delivery address';
      case 'delivered':
        return 'Your order has been successfully delivered';
      case 'cancelled':
        return 'This order has been cancelled';
      default:
        return 'Order status unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.075; // 7.5% VAT
  };

  const calculateDeliveryFee = () => {
    if (!order) return 0;
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return order.totalAmount - subtotal - tax;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error || 'Order not found'}
        </h3>
        <p className="text-gray-500 mb-6">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Button onClick={() => router.push('/dashboard/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Placed on {toJSDate(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {order.estimatedDeliveryDate && (
              <p className="text-blue-600 font-medium">
                Estimated delivery: {toJSDate(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={`${getOrderStatusColor(order.status)} border`}>
            {getOrderStatusIcon(order.status)}
            <span className="ml-2">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Order Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="font-medium">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getOrderStatusDescription(order.status)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {order.updatedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Items ({order.items.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover w-20 h-20"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      {item.vendor && (
                        <p className="text-sm text-gray-600">Vendor: {item.vendor}</p>
                      )}
                      {item.variant && (
                        <p className="text-sm text-blue-600 font-medium">Variant: {item.variant}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">{formatCurrency(item.price)} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Delivery Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{order.shippingAddress.name}</span>
                  <Badge variant="outline">{order.shippingAddress.type}</Badge>
                  {order.shippingAddress.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (7.5%):</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span>{formatCurrency(calculateDeliveryFee())}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Order Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items:</span>
                <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date:</span>
                <span>{toJSDate(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span>{order.updatedAt.toLocaleDateString()}</span>
              </div>
              {order.estimatedDeliveryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Delivery:</span>
                  <span className="font-medium text-blue-600">
                    {toJSDate(order.estimatedDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.notes && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600">Notes:</span>
                  <p className="text-sm mt-1">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DownloadableReceipt
                orderData={{
                  reference: order.orderNumber,
                  user: {
                    name: order.shippingAddress.name,
                    email: user?.email || '',
                    address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`,
                    phone: order.shippingAddress.phone || '',
                  },
                  items: order.items.map(item => ({
                    productName: item.name,
                    unitPrice: item.price,
                    quantity: item.quantity,
                    color: '', // Add color if available in your order item structure
                  })),
                  totalAmount: order.totalAmount,
                  transportFare: calculateDeliveryFee(),
                  distance: 0, // You might want to store this in the order data
                  weight: 0, // You might want to store this in the order data
                }}
                buttonProps={{
                  className: "w-full",
                  variant: "outline" as const,
                  children: (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </>
                  )
                }}
              />
              {order.status === 'delivered' && (
                <Button className="w-full">
                  Rate & Review Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}