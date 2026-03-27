'use client';

import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', className }: QuantityStepperProps) {
  const btnSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs w-7' : 'text-sm w-9';

  return (
    <div className={cn('inline-flex items-center border border-border rounded-lg', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(btnSize, 'flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 rounded-l-lg')}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSize} />
      </button>
      <span className={cn(textSize, 'text-center font-medium select-none')}>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(btnSize, 'flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 rounded-r-lg')}
        aria-label="Increase quantity"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
