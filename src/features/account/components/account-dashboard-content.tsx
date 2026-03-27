'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks';
import { orderService } from '@/services/orders';
import { prescriptionService } from '@/services/prescription';
import { addressService } from '@/services/address';
import { wishlistService } from '@/services/wishlist';
import { Order, Prescription } from '@/types';
import { AccountStatCard } from '@/components/account/account-stat-card';
import { OrderCard } from '@/components/order/order-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Package, FileText, MapPin, Heart, ArrowRight } from 'lucide-react';

export function AccountDashboardContent() {
  const { userName, userId } = useCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [addressCount, setAddressCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const [o, p, a, w] = await Promise.all([
          orderService.getOrders(userId!),
          prescriptionService.getPrescriptions(userId!),
          addressService.getAddresses(userId!),
          wishlistService.getWishlistIds(userId!),
        ]);
        setOrders(o);
        setPrescriptions(p);
        setAddressCount(a.length);
        setWishlistCount(w.length);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const pendingOrders = orders.filter((o) =>
    ['pending', 'prescription_review_pending', 'processing'].includes(o.orderStatus)
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
        <p className="text-sm text-muted-foreground">Manage your orders, prescriptions, and account settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AccountStatCard label="Total Orders" value={orders.length} icon={<Package className="h-5 w-5" />} />
        <AccountStatCard label="Prescriptions" value={prescriptions.length} icon={<FileText className="h-5 w-5" />} />
        <AccountStatCard label="Addresses" value={addressCount} icon={<MapPin className="h-5 w-5" />} />
        <AccountStatCard label="Wishlist" value={wishlistCount} icon={<Heart className="h-5 w-5" />} />
      </div>

      {/* Pending alert */}
      {pendingOrders > 0 && (
        <Card className="bg-warning/10 border-warning/20">
          <p className="text-sm font-medium">You have {pendingOrders} pending order{pendingOrders > 1 ? 's' : ''}</p>
          <Link href="/account/orders" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1">
            View Orders <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        {orders.length === 0 ? (
          <Card><p className="text-sm text-muted-foreground">No orders yet</p></Card>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} href={`/account/orders/${order.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
