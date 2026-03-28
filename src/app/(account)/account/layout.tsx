'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Lock, User, Package, FileText, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { authService } from '@/services/auth';
import { useTranslation } from '@/lib/i18n/use-translation';
import { type TranslationKey } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const mobileTabDefs: { href: string; labelKey: TranslationKey; icon: typeof User; exact?: boolean }[] = [
  { href: '/account', labelKey: 'account.home', icon: User, exact: true },
  { href: '/account/orders', labelKey: 'account.orders', icon: Package },
  { href: '/account/prescriptions', labelKey: 'account.rx', icon: FileText },
  { href: '/account/addresses', labelKey: 'account.address', icon: MapPin },
  { href: '/account/wishlist', labelKey: 'account.wishlist', icon: Heart },
  { href: '/account/profile', labelKey: 'account.profile', icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const { t } = useTranslation();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container-custom py-6">
        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          <Skeleton className="h-64 rounded-xl hidden md:block" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <Card className="max-w-md text-center" padding="lg">
          <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t('auth.loginRequired')}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t('auth.loginRequiredDesc')}</p>
          <Link href="/login"><Button fullWidth>{t('auth.signIn')}</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-4 md:py-6">
      {/* Mobile account tabs */}
      <div className="md:hidden mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max pb-2">
          {mobileTabDefs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {t(tab.labelKey)}
              </Link>
            );
          })}
          <button
            onClick={async () => { await authService.logout(); router.push('/'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-danger bg-danger/5 hover:bg-danger/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('nav.logout')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="hidden md:block">
          <div className="sticky top-24">
            <AccountSidebar />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
