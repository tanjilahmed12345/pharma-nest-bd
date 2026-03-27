import { OrderSuccessContent } from '@/features/orders/components/order-success-content';

export const metadata = {
  title: 'Order Placed | PharmaNest BD',
};

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderSuccessContent orderNumber={orderNumber} />;
}
