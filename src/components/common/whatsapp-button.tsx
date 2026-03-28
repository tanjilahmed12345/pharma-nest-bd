'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

const WHATSAPP_NUMBER = '8809638123456';
const DEFAULT_MESSAGE = 'Hi PharmaNest BD, I need help with my medicine order.';

export function WhatsAppButton() {
  const { t } = useTranslation();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
    >
      <MessageCircle className="h-7 w-7 fill-white stroke-white" />
      <span className="absolute right-full mr-3 bg-card text-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {t('footer.chatWithUs')}
      </span>
    </a>
  );
}
