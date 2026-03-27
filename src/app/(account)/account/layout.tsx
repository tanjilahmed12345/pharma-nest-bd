'use client';

import { useCurrentUser } from '@/hooks';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser();

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
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-muted-foreground mb-6">Please sign in to access your account.</p>
          <Link href="/login"><Button fullWidth>Sign In</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
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
