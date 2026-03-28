'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui/drawer';
import { useNotificationStore } from '@/store/notification.store';
import { Notification } from '@/types';
import { Package, FileText, Wallet, Tag, Info, CheckCheck, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, typeof Package> = {
  order: Package,
  prescription: FileText,
  payment: Wallet,
  promo: Tag,
  system: Info,
};

const typeColors: Record<string, string> = {
  order: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  prescription: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  payment: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  promo: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  system: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
}

function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const Icon = typeIcons[notification.type] || Info;
  const colorClass = typeColors[notification.type] || typeColors.system;

  const handleClick = () => {
    if (!notification.isRead) markAsRead(notification.id);
    onClose();
  };

  const content = (
    <div className={cn(
      'flex gap-3 px-4 py-3 transition-colors',
      notification.isRead ? 'opacity-60' : 'bg-primary/3',
      notification.href ? 'hover:bg-muted/50 cursor-pointer' : '',
    )}>
      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (notification.href) {
    return <Link href={notification.href} onClick={handleClick}>{content}</Link>;
  }

  return <div onClick={handleClick}>{content}</div>;
}

export function NotificationDrawer() {
  const isOpen = useNotificationStore((s) => s.isDrawerOpen);
  const setOpen = useNotificationStore((s) => s.setDrawerOpen);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const { t } = useTranslation();

  return (
    <Drawer isOpen={isOpen} onClose={() => setOpen(false)} side="right" title={t('notification.title')}>
      {/* Actions bar */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          {unreadCount() > 0 && (
            <button onClick={markAllAsRead} className="flex items-center gap-1 text-[11px] text-primary hover:underline">
              <CheckCheck className="h-3 w-3" /> {t('notification.markAllRead')}
            </button>
          )}
          <button onClick={clearAll} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-danger ml-auto">
            <Trash2 className="h-3 w-3" /> {t('notification.clearAll')}
          </button>
        </div>
      )}

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <Info className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">{t('notification.empty')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('notification.emptyDesc')}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClose={() => setOpen(false)} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
