'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { adminOrderService } from '@/services/admin';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';
import { AdminPageHeader } from './admin-page-header';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/order/order-status-badge';
import { StatusPill } from '@/components/common/status-pill';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Eye, ShoppingCart } from 'lucide-react';

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'prescription_review_pending', label: 'Rx Review' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
];

export function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminOrderService.getAllOrders().then(setOrders).finally(() => setIsLoading(false));
  }, []);

  let filtered = activeTab === 'all' ? orders : orders.filter((o) => o.orderStatus === activeTab);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((o) => o.orderNumber.toLowerCase().includes(q));
  }

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader title="Orders" description={`${orders.length} total orders`} />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />
      <AdminTableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by order number..." />

      {filtered.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="h-12 w-12" />} title="No orders found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <p className="font-mono font-medium text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                <TableCell className="font-medium text-sm">{formatPrice(o.total)}</TableCell>
                <TableCell><OrderStatusBadge status={o.orderStatus} /></TableCell>
                <TableCell className="hidden md:table-cell"><StatusPill status={o.paymentStatus} label={PAYMENT_STATUS_LABELS[o.paymentStatus] || o.paymentStatus} /></TableCell>
                <TableCell>
                  <Link href={`/admin/orders/${o.id}`}>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
