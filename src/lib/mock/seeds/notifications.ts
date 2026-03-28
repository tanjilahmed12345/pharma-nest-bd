import { Notification } from '@/types';

export const seedNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'system',
    title: 'Welcome to PharmaNest BD!',
    message: 'Your account is ready. Browse genuine medicines and get them delivered to your doorstep.',
    href: '/shop',
    isRead: false,
    createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'notif-2',
    type: 'promo',
    title: 'Get ৳50 off your first order',
    message: 'Use code WELCOME50 at checkout. Minimum order ৳500.',
    href: '/shop',
    isRead: false,
    createdAt: '2026-03-28T10:05:00Z',
  },
  {
    id: 'notif-3',
    type: 'order',
    title: 'Order confirmed',
    message: 'Your order PN-20260315-R1X has been placed successfully. We will process it shortly.',
    href: '/account/orders',
    isRead: true,
    createdAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'notif-4',
    type: 'prescription',
    title: 'Prescription approved',
    message: 'Your prescription has been reviewed and approved by our pharmacist.',
    href: '/account/prescriptions',
    isRead: true,
    createdAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'notif-5',
    type: 'payment',
    title: 'Payment verified',
    message: 'Your bKash payment of ৳435.00 has been verified. Your order is now being processed.',
    href: '/account/orders',
    isRead: true,
    createdAt: '2026-03-15T16:00:00Z',
  },
];
