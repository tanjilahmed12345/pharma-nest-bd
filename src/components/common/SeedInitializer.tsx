'use client';

import { useEffect } from 'react';
import { initializeMockDatabase } from '@/lib/mock/seed-initializer';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useNotificationStore } from '@/store/notification.store';

export function SeedInitializer() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const loadCart = useCartStore((s) => s.loadCart);
  const initTheme = useUIStore((s) => s.initTheme);
  const setDataReady = useUIStore((s) => s.setDataReady);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);

  useEffect(() => {
    initializeMockDatabase();
    loadSession();
    loadCart();
    initTheme();
    loadNotifications();
    setDataReady();
  }, [loadSession, loadCart, initTheme, loadNotifications, setDataReady]);

  return null;
}
