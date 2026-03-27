'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <label htmlFor={inputId} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            'h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer',
            className
          )}
          {...props}
        />
        {label && <span className="text-sm text-foreground">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
