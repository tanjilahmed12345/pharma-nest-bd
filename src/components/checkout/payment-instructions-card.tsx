import { PaymentMethod } from '@/types';
import { MERCHANT_INFO } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

export interface PaymentInstructionsCardProps {
  method: PaymentMethod;
}

export function PaymentInstructionsCard({ method }: PaymentInstructionsCardProps) {
  if (method === PaymentMethod.COD) {
    return (
      <Card className="bg-green-50 border-green-200">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">Cash on Delivery</p>
            <p>Pay with cash when your order is delivered. No advance payment required.</p>
          </div>
        </div>
      </Card>
    );
  }

  const info = MERCHANT_INFO[method as keyof typeof MERCHANT_INFO];
  if (!info) return null;

  return (
    <Card>
      <p className="text-sm font-semibold mb-2">Payment Instructions - {info.merchantName}</p>
      <p className="text-sm text-muted-foreground mb-3">
        Merchant Number: <span className="font-mono font-bold text-foreground">{info.merchantNumber}</span>
      </p>
      <ol className="space-y-1.5">
        {info.instructions.map((step, idx) => (
          <li key={idx} className="text-xs text-muted-foreground flex gap-2">
            <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
    </Card>
  );
}
