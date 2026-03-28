'use client';

import { useEffect } from 'react';
import { initializeMockDatabase } from '@/lib/mock/seed-initializer';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';

export function SeedInitializer() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const loadCart = useCartStore((s) => s.loadCart);
  const initTheme = useUIStore((s) => s.initTheme);
  const setDataReady = useUIStore((s) => s.setDataReady);

  useEffect(() => {
    initializeMockDatabase();
    loadSession();
    loadCart();
    initTheme();
    setDataReady();
  }, [loadSession, loadCart, initTheme, setDataReady]);

  return null;
}
