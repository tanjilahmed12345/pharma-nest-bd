'use client';

import { useMemo } from 'react';
import { divisions, districts, upazilas } from '@/lib/mock/seeds/bangladesh-geo';
import { SelectOption } from '@/types';

export function useAddressForm() {
  const divisionOptions: SelectOption[] = useMemo(
    () => divisions.map((d) => ({ label: d.name, value: d.name })),
    []
  );

  function getDistrictsForDivision(divisionName: string): SelectOption[] {
    if (!divisionName) return [];
    const div = divisions.find((d) => d.name === divisionName);
    if (!div) return [];
    return districts
      .filter((d) => d.divisionId === div.id)
      .map((d) => ({ label: d.name, value: d.name }));
  }

  function getUpazilasForDistrict(districtName: string): SelectOption[] {
    if (!districtName) return [];
    const dist = districts.find((d) => d.name === districtName);
    if (!dist) return [];
    return upazilas
      .filter((u) => u.districtId === dist.id)
      .map((u) => ({ label: u.name, value: u.name }));
  }

  return {
    divisionOptions,
    getDistrictsForDivision,
    getUpazilasForDistrict,
  };
}
