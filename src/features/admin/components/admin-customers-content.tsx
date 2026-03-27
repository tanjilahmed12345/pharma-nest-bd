'use client';

import { useEffect, useState } from 'react';
import { PublicUser, Order } from '@/types';
import { userService } from '@/services/user';
import { orderService } from '@/services/orders';
import { formatDate, formatPrice } from '@/lib/utils';
import { AdminPageHeader } from './admin-page-header';
import { AdminTableToolbar } from '@/components/admin/admin-table-toolbar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Users } from 'lucide-react';

interface CustomerRow {
  user: PublicUser;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export function AdminCustomersContent() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const [users, orders] = await Promise.all([
        userService.getCustomers(),
        orderService.getOrders(),
      ]);

      const rows: CustomerRow[] = users.map((user) => {
        const userOrders = orders.filter((o) => o.userId === user.id);
        return {
          user,
          orderCount: userOrders.length,
          totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
          lastOrderDate: userOrders.length > 0 ? userOrders[0].createdAt : null,
        };
      });

      setCustomers(rows);
      setIsLoading(false);
    }
    load();
  }, []);

  const filtered = search
    ? customers.filter((c) =>
        c.user.name.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email.toLowerCase().includes(search.toLowerCase()) ||
        c.user.phone.includes(search)
      )
    : customers;

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}</div>;

  return (
    <div>
      <AdminPageHeader title="Customers" description={`${customers.length} registered customers`} />
      <AdminTableToolbar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search by name, email, phone..." />

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title="No customers found" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="hidden md:table-cell">Spent</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.user.id}>
                <TableCell>
                  <p className="font-medium text-sm">{c.user.name}</p>
                  <p className="text-xs text-muted-foreground">{c.user.email}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm">{c.user.phone}</TableCell>
                <TableCell className="text-sm font-medium">{c.orderCount}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{formatPrice(c.totalSpent)}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(c.user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
