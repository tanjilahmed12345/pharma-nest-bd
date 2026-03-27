'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminDashboardService } from '@/services/admin';
import { DashboardStats } from '@/types';
import { formatPrice } from '@/lib/utils';
import { DashboardStatCard } from '@/components/admin/dashboard-stat-card';
import { OrderCard } from '@/components/order/order-card';
import { AdminPageHeader } from './admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import {
  ShoppingCart, DollarSign, FileText, Wallet,
  Package, AlertTriangle, Plus, ClipboardCheck, CreditCard,
} from 'lucide-react';

export function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminDashboardService.getDashboardStats().then(setStats).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard" description="Overview of your pharmacy operations" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardStatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart className="h-5 w-5" />} />
        <DashboardStatCard title="Revenue" value={formatPrice(stats.totalRevenue)} icon={<DollarSign className="h-5 w-5" />} />
        <DashboardStatCard title="Pending Orders" value={stats.pendingOrders} icon={<Package className="h-5 w-5" />} />
        <DashboardStatCard title="Delivered" value={stats.deliveredOrders} icon={<Package className="h-5 w-5" />} />
        <DashboardStatCard title="Pending Rx" value={stats.pendingPrescriptions} icon={<FileText className="h-5 w-5" />} />
        <DashboardStatCard title="Pending Payments" value={stats.pendingPayments} icon={<Wallet className="h-5 w-5" />} />
        <DashboardStatCard title="Low Stock" value={stats.lowStockProducts.length} icon={<AlertTriangle className="h-5 w-5" />} />
        <DashboardStatCard title="Customers" value={stats.totalCustomers} icon={<Package className="h-5 w-5" />} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/products/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Add Product</Button></Link>
        <Link href="/admin/prescriptions"><Button size="sm" variant="outline"><ClipboardCheck className="h-3.5 w-3.5" /> Review Prescriptions</Button></Link>
        <Link href="/admin/payments"><Button size="sm" variant="outline"><CreditCard className="h-3.5 w-3.5" /> Verify Payments</Button></Link>
        <Link href="/admin/orders"><Button size="sm" variant="outline"><ShoppingCart className="h-3.5 w-3.5" /> Manage Orders</Button></Link>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {stats.recentOrders.slice(0, 5).map((order) => (
            <OrderCard key={order.id} order={order} href={`/admin/orders/${order.id}`} />
          ))}
        </div>
      </div>

      {/* Low stock */}
      {stats.lowStockProducts.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Products</h3>
          <div className="space-y-1">
            {stats.lowStockProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1">
                <span>{p.name}</span>
                <span className="text-danger font-medium">{p.stockQty} left</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
