'use client';

import { useState } from 'react';
import { Address } from '@/types';
import { addressService } from '@/services/address';
import { AddressSelector } from '@/components/checkout/address-selector';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AddressForm } from './address-form';
import { AddressFormData } from '@/lib/validators';
import { nowISO } from '@/lib/utils';

interface CheckoutAddressStepProps {
  userId: string;
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  onAddAddress: (address: Address) => void;
  onContinue: () => void;
  canProceed: boolean;
}

export function CheckoutAddressStep({
  userId,
  addresses,
  selectedAddressId,
  onSelect,
  onAddAddress,
  onContinue,
  canProceed,
}: CheckoutAddressStepProps) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAddress = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      const address = await addressService.createAddress({
        ...data,
        userId,
        alternatePhone: data.alternatePhone || '',
        landmark: data.landmark || '',
        deliveryNote: data.deliveryNote || '',
        isDefault: addresses.length === 0,
      });
      onAddAddress(address);
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Delivery Address</h2>
        <p className="text-sm text-muted-foreground">Select or add a delivery address</p>
      </div>

      <AddressSelector
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={onSelect}
        onAddNew={() => setShowForm(true)}
      />

      <Modal isOpen={showForm && addresses.length > 0} onClose={() => setShowForm(false)} title="Add New Address" size="lg">
        <AddressForm
          onSubmit={handleSaveAddress}
          onCancel={() => setShowForm(false)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Inline form when no addresses exist */}
      {addresses.length === 0 && showForm && (
        <div className="border border-border rounded-xl p-4 bg-card">
          <h3 className="text-sm font-semibold mb-3">Add Your First Address</h3>
          <AddressForm
            onSubmit={handleSaveAddress}
            onCancel={() => {}}
            isLoading={isSaving}
          />
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={onContinue} disabled={!canProceed}>
          Continue to {addresses.length > 0 ? 'Next Step' : 'Add Address First'}
        </Button>
      </div>
    </div>
  );
}
