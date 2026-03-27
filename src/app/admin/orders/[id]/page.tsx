import { AdminOrderDetailsContent } from '@/features/admin/components/admin-order-details-content';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminOrderDetailsContent orderId={id} />;
}
