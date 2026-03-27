'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks';
import { addressService } from '@/services/address';
import { Address } from '@/types';
import { AddressFormData } from '@/lib/validators';
import { AddressCard } from '@/components/checkout/address-card';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { AddressForm } from '@/features/checkout/components/address-form';
import { MapPin, Plus } from 'lucide-react';

export function AccountAddressesContent() {
  const { userId } = useCurrentUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadAddresses = async () => {
    if (!userId) return;
    const data = await addressService.getAddresses(userId);
    setAddresses(data);
    setIsLoading(false);
  };

  useEffect(() => { loadAddresses(); }, [userId]);

  const handleAdd = async (data: AddressFormData) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await addressService.createAddress({
        ...data,
        userId,
        alternatePhone: data.alternatePhone || '',
        landmark: data.landmark || '',
        deliveryNote: data.deliveryNote || '',
        isDefault: addresses.length === 0,
      });
      await loadAddresses();
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await addressService.deleteAddress(id);
    await loadAddresses();
  };

  const handleSetDefault = async (id: string) => {
    if (!userId) return;
    await addressService.setDefaultAddress(userId, id);
    await loadAddresses();
  };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-12 w-12" />}
          title="No saved addresses"
          description="Add a delivery address for faster checkout."
          action={<Button onClick={() => setShowForm(true)}>Add Address</Button>}
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onDelete={() => handleDelete(addr.id)}
              onSelect={addr.isDefault ? undefined : () => handleSetDefault(addr.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Address" size="lg">
        <AddressForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}
