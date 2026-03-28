'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';
import { type TranslationKey } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const faqKeys: { q: TranslationKey; a: TranslationKey }[] = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

export function FaqPreview() {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-10">
      <div className="container-custom">
        <SectionHeader title={t('section.faq')} viewAllHref="/faq" viewAllLabel={t('section.viewAllFaq')} />

        <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-start">
          {/* Left description */}
          <div className="hidden md:block">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('faq.faqDesc')}
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-2.5">
            {faqKeys.map((faq, idx) => {
              const isOpen = open === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    'rounded-xl border overflow-hidden transition-colors',
                    isOpen ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground text-left hover:bg-primary/5 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn(
                        'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        isOpen ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}>
                        {idx + 1}
                      </span>
                      {t(faq.q)}
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-primary'
                    )} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pl-14 text-sm text-muted-foreground leading-relaxed">
                      {t(faq.a)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
