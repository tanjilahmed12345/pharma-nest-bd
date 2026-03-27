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

  useEffect(() => {
    initializeMockDatabase();
    loadSession();
    loadCart();
    initTheme();
  }, [loadSession, loadCart, initTheme]);

  return null;
}
