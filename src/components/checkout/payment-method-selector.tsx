'use client';

import { PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';
import { Wallet, Banknote } from 'lucide-react';

export interface PaymentMethodSelectorProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const methods = [
  { id: PaymentMethod.BKASH, label: 'bKash', color: 'bg-pink-50 border-pink-300 text-pink-700', icon: Wallet },
  { id: PaymentMethod.NAGAD, label: 'Nagad', color: 'bg-orange-50 border-orange-300 text-orange-700', icon: Wallet },
  { id: PaymentMethod.ROCKET, label: 'Rocket', color: 'bg-purple-50 border-purple-300 text-purple-700', icon: Wallet },
  { id: PaymentMethod.COD, label: 'Cash on Delivery', color: 'bg-green-50 border-green-300 text-green-700', icon: Banknote },
];

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((m) => {
        const isSelected = selected === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
              isSelected ? `${m.color} border-2` : 'border-border hover:border-primary/30 bg-card'
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-sm font-semibold">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
