'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { ChevronDown } from 'lucide-react';
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
    <section className="py-6 md:py-8 bg-muted/30">
      <div className="container-custom">
        <SectionHeader title="Frequently Asked Questions" viewAllHref="/faq" viewAllLabel="View All FAQ" />
        <div className="max-w-2xl space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground text-left hover:bg-muted/30 transition-colors"
              >
                {faq.q}
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open === idx && 'rotate-180')} />
              </button>
              {open === idx && (
                <div className="px-4 pb-3 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
