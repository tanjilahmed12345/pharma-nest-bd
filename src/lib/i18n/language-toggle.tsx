'use client';

import { useLanguageStore } from '@/store/language.store';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
      className="h-8 px-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1 text-xs font-semibold"
      aria-label={locale === 'en' ? 'Switch to Bangla' : 'Switch to English'}
    >
      <span className={cn('transition-opacity', locale === 'en' ? 'opacity-100' : 'opacity-40')}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={cn('transition-opacity', locale === 'bn' ? 'opacity-100' : 'opacity-40')}>বাং</span>
    </button>
  );
}
