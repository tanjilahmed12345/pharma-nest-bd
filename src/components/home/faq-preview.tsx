'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'How do I order medicines online?',
    a: 'Browse our catalog, add medicines to your cart, and proceed to checkout. You can pay with bKash, Nagad, Rocket, or Cash on Delivery.',
  },
  {
    q: 'Do I need a prescription for all medicines?',
    a: 'No. Over-the-counter (OTC) medicines can be ordered without a prescription. Prescription medicines require a valid prescription from a licensed doctor.',
  },
  {
    q: 'How do I upload a prescription?',
    a: 'Click "Upload Prescription" from the homepage or during checkout. Take a clear photo of your prescription and upload it along with patient details.',
  },
  {
    q: 'What are the delivery charges?',
    a: 'We charge ৳60 for delivery. Orders above ৳500 get free delivery across Bangladesh.',
  },
  {
    q: 'How can I track my order?',
    a: 'Go to "Track Order" page and enter your order number and phone number to see real-time status updates.',
  },
];

export function FaqPreview() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-8 md:py-10">
      <div className="container-custom">
        <SectionHeader title="Frequently Asked Questions" viewAllHref="/faq" viewAllLabel="View All FAQ" />

        <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-start">
          {/* Left description */}
          <div className="hidden md:block">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have questions about ordering medicines, prescriptions, or delivery? Find quick answers below or contact our support team.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
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
                      {faq.q}
                    </span>
                    <ChevronDown className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-primary'
                    )} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pl-14 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
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
