import { AccountOrderDetailsContent } from '@/features/account/components/account-order-details-content';

export const metadata = { title: 'Order Details | PharmaNest BD' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AccountOrderDetailsContent orderId={id} />;
}
