'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'How do I order medicines online?', a: 'Browse our catalog, add medicines to your cart, and proceed to checkout. You can pay with bKash, Nagad, Rocket, or Cash on Delivery.' },
  { q: 'Do I need a prescription for all medicines?', a: 'No. Over-the-counter (OTC) medicines can be ordered without a prescription. Prescription medicines require a valid prescription from a licensed doctor.' },
  { q: 'How do I upload a prescription?', a: 'Click "Upload Prescription" from the homepage or during checkout. Take a clear photo of your prescription and upload it along with patient details.' },
  { q: 'What are the delivery charges?', a: 'We charge ৳60 for standard delivery. Orders above ৳500 qualify for free delivery across Bangladesh.' },
  { q: 'How can I track my order?', a: 'Go to the "Track Order" page and enter your order number and phone number to see real-time status updates.' },
  { q: 'How long does delivery take?', a: 'Inside Dhaka: 1-2 business days. Outside Dhaka: 2-5 business days. Prescription orders may take additional time for pharmacist review.' },
  { q: 'Can I return medicines?', a: 'Due to safety regulations, medicines cannot be returned once delivered. However, if you receive a damaged or wrong product, please contact us immediately.' },
  { q: 'Are the medicines genuine?', a: 'Yes, all medicines are sourced directly from licensed manufacturers and authorized distributors in Bangladesh.' },
  { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, Rocket mobile wallets, and Cash on Delivery (COD).' },
  { q: 'How is my prescription reviewed?', a: 'Our licensed pharmacist reviews your prescription for validity, dosage accuracy, and potential drug interactions before processing your order.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} className="mb-6" />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-6">Find answers to common questions about PharmaNest BD.</p>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className={cn('rounded-xl border overflow-hidden', open === idx ? 'bg-primary/5 border-primary/20' : 'bg-card border-border')}>
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-foreground text-left hover:bg-primary/5 transition-colors"
              >
                {faq.q}
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open === idx && 'rotate-180 text-primary')} />
              </button>
              {open === idx && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
