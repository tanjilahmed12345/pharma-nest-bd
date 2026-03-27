'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/hooks';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Drawer } from '@/components/ui/drawer';
import { Lock, ShieldAlert, Menu } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useCurrentUser();
  const [mobileNav, setMobileNav] = useState(false);

  if (isLoading) {
    return <div className="flex min-h-screen"><Skeleton className="w-60 hidden lg:block" /><div className="flex-1 p-6"><Skeleton className="h-16 mb-4 rounded-xl" /><Skeleton className="h-96 rounded-xl" /></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md text-center" padding="lg">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-muted-foreground mb-4">Please sign in to access the admin panel.</p>
          <Link href="/login"><Button fullWidth>Sign In</Button></Link>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md text-center" padding="lg">
          <ShieldAlert className="h-10 w-10 text-danger mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">You do not have permission to access the admin panel.</p>
          <Link href="/"><Button fullWidth variant="outline">Back to Store</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Mobile nav toggle */}
      <Drawer isOpen={mobileNav} onClose={() => setMobileNav(false)} side="left" title="Admin Menu">
        <div className="p-2"><AdminSidebar /></div>
      </Drawer>

      <div className="lg:pl-60">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-30 h-14 bg-header-bg border-b border-border flex items-center px-4">
          <button onClick={() => setMobileNav(true)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-semibold text-sm">Admin Panel</span>
        </div>

        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
