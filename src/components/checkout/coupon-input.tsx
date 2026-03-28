'use client';

import { useState } from 'react';
import { checkoutService } from '@/services/checkout';
import { Button } from '@/components/ui/button';
import { Tag, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CouponInputProps {
  subtotal: number;
  appliedCoupon: { code: string; discount: number } | null;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
}

export function CouponInput({ subtotal, appliedCoupon, onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    setIsValidating(true);
    setError('');

    const result = checkoutService.validateCoupon(code.trim(), subtotal);
    if (result.valid) {
      onApply(code.trim().toUpperCase(), result.discountAmount);
      setCode('');
    } else {
      setError(result.message);
    }
    setIsValidating(false);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-secondary" />
          <div>
            <span className="text-xs font-bold text-secondary">{appliedCoupon.code}</span>
            <span className="text-xs text-muted-foreground ml-1.5">-৳{appliedCoupon.discount} off</span>
          </div>
        </div>
        <button onClick={onRemove} className="p-1 hover:bg-secondary/10 rounded transition-colors">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter coupon code"
            className={cn(
              'w-full h-9 pl-8 pr-3 text-xs bg-input-bg border rounded-lg outline-none transition-colors',
              error ? 'border-danger' : 'border-border focus:border-primary'
            )}
          />
        </div>
        <Button size="sm" variant="outline" onClick={handleApply} isLoading={isValidating} className="text-xs px-3">
          Apply
        </Button>
      </div>
      {error && <p className="text-[11px] text-danger mt-1">{error}</p>}
      <p className="text-[10px] text-muted-foreground mt-1">Try: PHARMA10, WELCOME50, HEALTH20</p>
    </div>
  );
}
