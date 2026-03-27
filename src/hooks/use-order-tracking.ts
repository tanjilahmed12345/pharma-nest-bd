'use client';

import { useState, useCallback } from 'react';
import { orderService } from '@/services/orders';
import { Order } from '@/types';

/**
 * Hook for public order tracking by order number + phone.
 */
export function useOrderTracking() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = useCallback(async (orderNumber: string, phone: string) => {
    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await orderService.trackOrder(orderNumber, phone);
      setOrder(result);
    } catch (err: any) {
      setError(err.message || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  return { order, isLoading, error, trackOrder, reset };
}
