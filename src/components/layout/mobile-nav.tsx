'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui/drawer';
import { Logo } from '@/components/common/logo';
import { useUIStore } from '@/store/ui.store';
import { useCurrentUser } from '@/hooks';
import {
  Home, ShoppingBag, Pill, FileText, Upload, Tag, User, LogIn, LayoutDashboard, Package,
} from 'lucide-react';

const publicLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop All', icon: ShoppingBag },
  { href: '/otc', label: 'OTC Medicines', icon: Pill },
  { href: '/rx', label: 'Prescription Medicines', icon: FileText },
  { href: '/upload-prescription', label: 'Upload Prescription', icon: Upload },
  { href: '/offers', label: 'Offers', icon: Tag },
];

const accountLinks = [
  { href: '/account', label: 'My Account', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/prescriptions', label: 'My Prescriptions', icon: FileText },
];

export function MobileNav() {
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenu);
  const { isAuthenticated, isAdmin } = useCurrentUser();

  return (
    <Drawer isOpen={isOpen} onClose={() => setOpen(false)} side="left" title="">
      <div className="p-4">
        <Logo size="lg" className="mb-6" />

        <nav className="space-y-1">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <link.icon className="h-4.5 w-4.5 text-muted-foreground" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="my-4 border-t border-border" />

        {isAuthenticated ? (
          <nav className="space-y-1">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <link.icon className="h-4.5 w-4.5 text-muted-foreground" />
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                Admin Panel
              </Link>
            )}
          </nav>
        ) : (
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <LogIn className="h-4.5 w-4.5" />
            Login / Register
          </Link>
        )}
      </div>
    </Drawer>
  );
}
