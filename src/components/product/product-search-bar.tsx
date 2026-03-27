'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}

export function ProductSearchBar({ value, onChange, onSubmit, placeholder = 'Search medicines...', className }: ProductSearchBarProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
      className={cn('relative', className)}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 rounded-lg border border-border text-sm bg-input-bg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </form>
  );
}
