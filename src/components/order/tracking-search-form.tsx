'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface TrackingSearchFormProps {
  onSearch: (orderNumber: string, phone: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TrackingSearchForm({ onSearch, isLoading, error }: TrackingSearchFormProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      onSearch(orderNumber.trim(), phone.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Order Number"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="e.g. PN-20250301-A1B"
      />
      <Input
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 01712345678"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" fullWidth isLoading={isLoading}>
        <Search className="h-4 w-4" />
        Track Order
      </Button>
    </form>
  );
}
