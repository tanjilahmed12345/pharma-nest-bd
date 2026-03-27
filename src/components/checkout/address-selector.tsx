'use client';

import { Address } from '@/types';
import { AddressCard } from './address-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
}

export function AddressSelector({ addresses, selectedId, onSelect, onAddNew }: AddressSelectorProps) {
  if (addresses.length === 0) {
    return (
      <EmptyState
        title="No saved addresses"
        description="Add a delivery address to proceed"
        action={
          onAddNew && (
            <Button onClick={onAddNew} size="sm">
              <Plus className="h-4 w-4" /> Add Address
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          selected={addr.id === selectedId}
          onSelect={() => onSelect(addr.id)}
        />
      ))}
      {onAddNew && (
        <Button variant="outline" onClick={onAddNew} size="sm" className="w-full">
          <Plus className="h-4 w-4" /> Add New Address
        </Button>
      )}
    </div>
  );
}
