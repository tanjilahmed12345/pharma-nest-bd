'use client';

import { useEffect } from 'react';
import { initializeMockDatabase } from '@/lib/mock/seed-initializer';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

export function SeedInitializer() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const loadCart = useCartStore((s) => s.loadCart);

  useEffect(() => {
    initializeMockDatabase();
    loadSession();
    loadCart();
  }, [loadSession, loadCart]);

  return null;
}
