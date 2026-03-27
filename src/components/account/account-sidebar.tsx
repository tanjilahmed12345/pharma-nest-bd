'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Package, FileText, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/account', label: 'Dashboard', icon: User, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/profile', label: 'Profile Settings', icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/5 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 transition-colors w-full"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );
}
