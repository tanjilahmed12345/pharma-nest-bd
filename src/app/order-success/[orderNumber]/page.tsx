import { Topbar } from '@/components/layout/topbar';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { OrderSuccessContent } from '@/features/orders/components/order-success-content';

export const metadata = {
  title: 'Order Placed | PharmaNest BD',
};

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return (
    <>
      <Topbar />
      <SiteHeader />
      <MobileNav />
      <SearchOverlay />
      <CartDrawer />
      <main className="flex-1">
        <OrderSuccessContent orderNumber={orderNumber} />
      </main>
      <SiteFooter />
    </>
  );
}
