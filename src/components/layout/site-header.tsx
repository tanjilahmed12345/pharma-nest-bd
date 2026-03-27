'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Upload } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useCurrentUser } from '@/hooks';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const itemCount = useCartStore((s) => s.getItemCount)();
  const toggleMobileMenu = useUIStore((s) => s.setMobileMenu);
  const setSearch = useUIStore((s) => s.setSearch);
  const setCartDrawer = useUIStore((s) => s.setCartDrawer);
  const { isAuthenticated, isAdmin } = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="container-custom">
        {/* Main header row */}
        <div className="flex items-center justify-between h-14 md:h-16 gap-4">
          {/* Mobile menu */}
          <button
            className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg"
            onClick={() => toggleMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo />

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <button
              onClick={() => setSearch(true)}
              className="w-full flex items-center gap-2 h-10 px-4 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search medicines, brands...
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSearch(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Upload Rx (desktop) */}
            <Link
              href="/upload-prescription"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Rx
            </Link>

            {/* Account */}
            <Link
              href={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/account') : '/login'}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setCartDrawer(true)}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 flex items-center justify-center text-[10px] font-bold bg-danger text-white rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 h-10 text-sm font-medium border-t border-border -mb-px">
          {[
            { href: '/shop', label: 'Shop All' },
            { href: '/otc', label: 'OTC Medicines' },
            { href: '/rx', label: 'Prescription' },
            { href: '/offers', label: 'Offers' },
            { href: '/upload-prescription', label: 'Upload Prescription' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
