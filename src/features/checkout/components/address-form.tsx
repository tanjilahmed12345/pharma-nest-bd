'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '@/lib/validators';
import { useAddressForm } from '@/hooks/use-address-form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, onCancel, isLoading }: AddressFormProps) {
  const { divisionOptions, getDistrictsForDivision, getUpazilasForDistrict } = useAddressForm();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      alternatePhone: '',
      division: '',
      district: '',
      upazila: '',
      postcode: '',
      area: '',
      addressLine: '',
      houseFlat: '',
      landmark: '',
      deliveryNote: '',
    },
  });

  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');

  const districtOptions = getDistrictsForDivision(selectedDivision);
  const upazilaOptions = getUpazilasForDistrict(selectedDistrict);

  // Reset dependent fields on parent change
  useEffect(() => {
    setValue('district', '');
    setValue('upazila', '');
  }, [selectedDivision, setValue]);

  useEffect(() => {
    setValue('upazila', '');
  }, [selectedDistrict, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Phone Number"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Input
        label="Alternate Phone (optional)"
        placeholder="01XXXXXXXXX"
        error={errors.alternatePhone?.message}
        {...register('alternatePhone')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Division"
          options={divisionOptions}
          placeholder="Select Division"
          error={errors.division?.message}
          {...register('division')}
        />
        <Select
          label="District"
          options={districtOptions}
          placeholder="Select District"
          error={errors.district?.message}
          disabled={!selectedDivision}
          {...register('district')}
        />
        <Select
          label="Upazila / Thana"
          options={upazilaOptions}
          placeholder="Select Upazila"
          error={errors.upazila?.message}
          disabled={!selectedDistrict}
          {...register('upazila')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Postcode"
          placeholder="e.g. 1205"
          error={errors.postcode?.message}
          {...register('postcode')}
        />
        <Input
          label="Area"
          placeholder="e.g. Dhanmondi"
          error={errors.area?.message}
          {...register('area')}
        />
      </div>

      <Input
        label="Address Line"
        placeholder="Road / Street name"
        error={errors.addressLine?.message}
        {...register('addressLine')}
      />

      <Input
        label="House / Flat"
        placeholder="House no, Flat no"
        error={errors.houseFlat?.message}
        {...register('houseFlat')}
      />

      <Input
        label="Landmark (optional)"
        placeholder="Near any landmark"
        {...register('landmark')}
      />

      <Textarea
        label="Delivery Note (optional)"
        placeholder="Any special instructions for delivery"
        rows={2}
        {...register('deliveryNote')}
      />

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            Save Address
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
