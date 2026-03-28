'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Upload, Bell } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { LanguageToggle } from '@/lib/i18n/language-toggle';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useNotificationStore } from '@/store/notification.store';
import { useCurrentUser } from '@/hooks';

export function SiteHeader() {
  const itemCount = useCartStore((s) => s.getItemCount)();
  const toggleMobileMenu = useUIStore((s) => s.setMobileMenu);
  const setSearch = useUIStore((s) => s.setSearch);
  const setCartDrawer = useUIStore((s) => s.setCartDrawer);
  const unreadCount = useNotificationStore((s) => s.unreadCount)();
  const setNotificationDrawer = useNotificationStore((s) => s.setDrawerOpen);
  const { isAuthenticated, isAdmin, userName } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-header-bg border-b border-border shadow-sm">
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
              {t('search.placeholder')}
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Mobile search */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSearch(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageToggle />

            {/* Notifications */}
            <button
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setNotificationDrawer(true)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 flex items-center justify-center text-[9px] font-bold bg-secondary text-white rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <ThemeToggle />

            {/* Account */}
            {isAuthenticated ? (
              <Link
                href={isAdmin ? '/admin/dashboard' : '/account'}
                className="flex items-center gap-1.5 h-8 pl-1 pr-2.5 bg-primary/10 hover:bg-primary/15 rounded-full transition-colors"
                aria-label="Account"
              >
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white">
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-xs font-medium text-primary max-w-[80px] truncate">
                  {userName?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-full transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">{t('nav.login')}</span>
              </Link>
            )}

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
            { href: '/shop', label: t('nav.shop') },
            { href: '/otc', label: t('nav.otc') },
            { href: '/rx', label: t('nav.prescription') },
            { href: '/offers', label: t('nav.offers') },
            { href: '/upload-prescription', label: t('nav.uploadRx') },
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
