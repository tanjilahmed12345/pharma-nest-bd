'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Package, FileText, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/use-translation';
import { type TranslationKey } from '@/lib/i18n/translations';

const linkDefs: { href: string; labelKey: TranslationKey; icon: typeof User; exact?: boolean }[] = [
  { href: '/account', labelKey: 'account.dashboard', icon: User, exact: true },
  { href: '/account/orders', labelKey: 'account.myOrders', icon: Package },
  { href: '/account/prescriptions', labelKey: 'account.prescriptions', icon: FileText },
  { href: '/account/addresses', labelKey: 'account.addresses', icon: MapPin },
  { href: '/account/wishlist', labelKey: 'account.wishlist', icon: Heart },
  { href: '/account/profile', labelKey: 'account.profile', icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/');
  };

  return (
    <nav className="space-y-1">
      {linkDefs.map((link) => {
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
            {t(link.labelKey)}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors w-full"
      >
        <LogOut className="h-4 w-4" />
        {t('nav.logout')}
      </button>
    </nav>
  );
}
