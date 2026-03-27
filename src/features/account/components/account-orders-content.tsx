'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks';
import { orderService } from '@/services/orders';
import { Order, OrderStatus } from '@/types';
import { OrderCard } from '@/components/order/order-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'prescription_review_pending', label: 'Rx Review' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function AccountOrdersContent() {
  const { userId } = useCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!userId) return;
    orderService.getOrders(userId).then(setOrders).finally(() => setIsLoading(false));
  }, [userId]);

  const filtered = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.orderStatus === activeTab);

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No orders found"
          description={activeTab === 'all' ? "You haven't placed any orders yet." : `No ${activeTab.replace('_', ' ')} orders.`}
          action={<Link href="/shop"><Button>Shop Now</Button></Link>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} href={`/account/orders/${order.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
