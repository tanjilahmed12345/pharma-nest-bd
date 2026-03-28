'use client';

import { useEffect } from 'react';
import { initializeMockDatabase } from '@/lib/mock/seed-initializer';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useUIStore } from '@/store/ui.store';
import { useNotificationStore } from '@/store/notification.store';
import { useLanguageStore } from '@/store/language.store';

export function SeedInitializer() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const loadCart = useCartStore((s) => s.loadCart);
  const initTheme = useUIStore((s) => s.initTheme);
  const setDataReady = useUIStore((s) => s.setDataReady);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);
  const initLocale = useLanguageStore((s) => s.initLocale);

  useEffect(() => {
    initializeMockDatabase();
    loadSession();
    loadCart();
    initTheme();
    initLocale();
    loadNotifications();
    setDataReady();
  }, [loadSession, loadCart, initTheme, initLocale, loadNotifications, setDataReady]);

  return null;
}
