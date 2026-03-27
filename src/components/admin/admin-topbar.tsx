'use client';

import { Menu, User } from 'lucide-react';
import { useCurrentUser } from '@/hooks';

export interface AdminTopbarProps {
  title: string;
  onMenuToggle?: () => void;
}

export function AdminTopbar({ title, onMenuToggle }: AdminTopbarProps) {
  const { userName } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-6">
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 mr-2 hover:bg-muted rounded-lg"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <h1 className="text-lg font-bold text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden sm:block font-medium">{userName || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
