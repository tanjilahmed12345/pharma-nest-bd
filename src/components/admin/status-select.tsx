'use client';

import { cn } from '@/lib/utils';
import { SelectOption } from '@/types';

export interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function StatusSelect({ value, onChange, options, className }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-8 px-2 rounded-md border border-border text-xs font-medium bg-input-bg focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
