'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui/drawer';
import { Logo } from '@/components/common/logo';
import { useUIStore } from '@/store/ui.store';
import { useCurrentUser } from '@/hooks';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import {
  Home, ShoppingBag, Pill, FileText, Upload, Tag, User, LogIn, LogOut,
  LayoutDashboard, Package, MapPin, Heart, Settings, Phone, Mail,
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
  { href: '/account', label: 'Dashboard', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/profile', label: 'Profile Settings', icon: Settings },
];

export function MobileNav() {
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenu);
  const { isAuthenticated, isAdmin } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    setOpen(false);
    await authService.logout();
    router.push('/');
  };

  return (
    <Drawer isOpen={isOpen} onClose={() => setOpen(false)} side="left" title="">
      <div className="p-4 flex flex-col h-full">
        <Logo size="lg" className="mb-6" />

        {/* Main navigation */}
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
          <>
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Account</p>
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

            <div className="my-4 border-t border-border" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors w-full"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </button>
          </>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              <LogIn className="h-4.5 w-4.5" />
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4.5 w-4.5 text-muted-foreground" />
              Create Account
            </Link>
          </div>
        )}

        {/* Contact info at bottom */}
        <div className="mt-auto pt-4 border-t border-border space-y-2">
          <a href="tel:09638123456" className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> 09638-123456
          </a>
          <a href="mailto:care@pharmanestbd.com" className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> care@pharmanestbd.com
          </a>
        </div>
      </div>
    </Drawer>
  );
}
