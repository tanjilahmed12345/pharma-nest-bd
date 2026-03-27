'use client';

import { PaymentMethod } from '@/types';
import { PaymentMethodSelector } from '@/components/checkout/payment-method-selector';
import { PaymentInstructionsCard } from '@/components/checkout/payment-instructions-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CheckoutPaymentStepProps {
  paymentMethod: PaymentMethod | null;
  senderNumber: string;
  transactionId: string;
  onSelectMethod: (method: PaymentMethod) => void;
  onSenderNumberChange: (value: string) => void;
  onTransactionIdChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export function CheckoutPaymentStep({
  paymentMethod,
  senderNumber,
  transactionId,
  onSelectMethod,
  onSenderNumberChange,
  onTransactionIdChange,
  onContinue,
  onBack,
  canProceed,
}: CheckoutPaymentStepProps) {
  const isWallet = paymentMethod && paymentMethod !== PaymentMethod.COD;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Payment Method</h2>
        <p className="text-sm text-muted-foreground">Choose how you want to pay</p>
      </div>

      <PaymentMethodSelector selected={paymentMethod} onSelect={onSelectMethod} />

      {paymentMethod && (
        <PaymentInstructionsCard method={paymentMethod} />
      )}

      {isWallet && (
        <div className="space-y-3 p-4 border border-border rounded-xl bg-card">
          <h3 className="text-sm font-semibold">Payment Details</h3>
          <Input
            label="Sender Number"
            placeholder="01XXXXXXXXX"
            value={senderNumber}
            onChange={(e) => onSenderNumberChange(e.target.value)}
            error={senderNumber && senderNumber.length < 11 ? 'Enter a valid 11-digit number' : undefined}
          />
          <Input
            label="Transaction ID"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) => onTransactionIdChange(e.target.value)}
            error={transactionId && transactionId.length < 4 ? 'Transaction ID must be at least 4 characters' : undefined}
          />
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onContinue} disabled={!canProceed}>
          Review Order
        </Button>
      </div>
    </div>
  );
}
