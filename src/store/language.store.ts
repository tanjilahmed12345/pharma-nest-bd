import { create } from 'zustand';
import { type Locale } from '@/lib/i18n/translations';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  initLocale: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: 'en',

  setLocale: (locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharma_locale', locale);
      document.documentElement.lang = locale;
    }
    set({ locale });
  },

  initLocale: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('pharma_locale') as Locale | null;
    const locale = saved || 'en';
    document.documentElement.lang = locale;
    set({ locale });
  },
}));
