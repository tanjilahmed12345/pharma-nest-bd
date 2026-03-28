import { create } from 'zustand';
import { Notification } from '@/types';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { generateId, nowISO } from '@/lib/utils';

interface NotificationState {
  notifications: Notification[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  loadNotifications: () => void;
  addNotification: (data: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isDrawerOpen: false,

  setDrawerOpen: (open) => set({ isDrawerOpen: open }),

  loadNotifications: () => {
    const saved = storage.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
    set({ notifications: saved });
  },

  addNotification: (data) => {
    const notification: Notification = {
      id: `notif-${generateId()}`,
      ...data,
      isRead: false,
      createdAt: nowISO(),
    };
    const updated = [notification, ...get().notifications];
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
    set({ notifications: updated });
  },

  clearAll: () => {
    storage.set(STORAGE_KEYS.NOTIFICATIONS, []);
    set({ notifications: [] });
  },

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));
