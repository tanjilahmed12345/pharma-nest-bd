'use client';

import { useLanguageStore } from '@/store/language.store';
import { t, type TranslationKey } from './translations';

export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);

  return {
    t: (key: TranslationKey) => t(key, locale),
    locale,
  };
}
