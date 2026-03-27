'use client';

import { useState, useEffect } from 'react';
import { checkoutService } from '@/services/checkout';
import { OrderPreview } from '@/types';

/**
 * Hook that computes and returns the current order preview.
 */
export function useCheckoutPreview() {
  const [preview, setPreview] = useState<OrderPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    checkoutService
      .getOrderPreview()
      .then((data) => {
        if (!cancelled) setPreview(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { preview, isLoading, error };
}
