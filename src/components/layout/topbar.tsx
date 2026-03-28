'use client';

import { Phone, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

export function Topbar() {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block bg-primary-dark text-white/90 text-xs">
      <div className="container-custom flex items-center justify-between py-1.5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> 09638-123456
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" /> care@pharmanestbd.com
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{t('topbar.genuine')}</span>
        </div>
      </div>
    </div>
  );
}
