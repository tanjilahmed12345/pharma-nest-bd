import { Topbar } from '@/components/layout/topbar';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { CartDrawer } from '@/components/cart/cart-drawer';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <SiteHeader />
      <MobileNav />
      <SearchOverlay />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
