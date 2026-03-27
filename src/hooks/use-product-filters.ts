'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductFilters, DosageForm } from '@/types';

/**
 * Hook for reading and updating product filter state via URL search params.
 * Keeps filters in the URL so backend integration becomes easier later.
 */
export function useProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {};

    const search = searchParams.get('q');
    if (search) f.search = search;

    const category = searchParams.get('category');
    if (category) f.category = category;

    const brand = searchParams.get('brand');
    if (brand) f.brand = brand;

    const manufacturer = searchParams.get('manufacturer');
    if (manufacturer) f.manufacturer = manufacturer;

    const dosageForm = searchParams.get('dosageForm');
    if (dosageForm) f.dosageForm = dosageForm as DosageForm;

    const priceMin = searchParams.get('priceMin');
    if (priceMin) f.priceMin = Number(priceMin);

    const priceMax = searchParams.get('priceMax');
    if (priceMax) f.priceMax = Number(priceMax);

    const rx = searchParams.get('rx');
    if (rx === 'true') f.isPrescriptionRequired = true;
    if (rx === 'false') f.isPrescriptionRequired = false;

    const inStock = searchParams.get('inStock');
    if (inStock === 'true') f.inStock = true;

    const sort = searchParams.get('sort');
    if (sort) f.sort = sort;

    const page = searchParams.get('page');
    if (page) f.page = Number(page);

    const pageSize = searchParams.get('pageSize');
    if (pageSize) f.pageSize = Number(pageSize);

    return f;
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Merge new filters
      const merged = { ...filters, ...newFilters };

      // Reset page when filters change (unless page is explicitly set)
      if (!('page' in newFilters)) {
        merged.page = 1;
      }

      // Update URL params
      params.delete('q');
      params.delete('category');
      params.delete('brand');
      params.delete('manufacturer');
      params.delete('dosageForm');
      params.delete('priceMin');
      params.delete('priceMax');
      params.delete('rx');
      params.delete('inStock');
      params.delete('sort');
      params.delete('page');
      params.delete('pageSize');

      if (merged.search) params.set('q', merged.search);
      if (merged.category) params.set('category', merged.category);
      if (merged.brand) params.set('brand', merged.brand);
      if (merged.manufacturer) params.set('manufacturer', merged.manufacturer);
      if (merged.dosageForm) params.set('dosageForm', merged.dosageForm);
      if (merged.priceMin !== undefined) params.set('priceMin', String(merged.priceMin));
      if (merged.priceMax !== undefined) params.set('priceMax', String(merged.priceMax));
      if (merged.isPrescriptionRequired !== undefined)
        params.set('rx', String(merged.isPrescriptionRequired));
      if (merged.inStock) params.set('inStock', 'true');
      if (merged.sort) params.set('sort', merged.sort);
      if (merged.page && merged.page > 1) params.set('page', String(merged.page));
      if (merged.pageSize) params.set('pageSize', String(merged.pageSize));

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, filters, router, pathname]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { filters, setFilters, clearFilters };
}
