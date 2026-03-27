import { IOrderRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Order, OrderStatus } from '@/types';
import { generateId, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

export const localOrderRepository: IOrderRepository = {
  async getAll(userId?: string): Promise<Order[]> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    const filtered = userId ? orders.filter((o) => o.userId === userId) : orders;
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<Order | null> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    return orders.find((o) => o.id === id) || null;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  },

  async create(data): Promise<Order> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    const order: Order = {
      ...data,
      id: `order-${generateId()}`,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    orders.push(order);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  async updateStatus(id, status, note?): Promise<Order> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw AppError.notFound('Order');

    orders[idx].orderStatus = status;
    orders[idx].statusTimeline.push({
      status,
      timestamp: nowISO(),
      note,
    });
    orders[idx].updatedAt = nowISO();
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },

  async update(id, data): Promise<Order> {
    const orders = storage.get<Order[]>(STORAGE_KEYS.ORDERS) || [];
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw AppError.notFound('Order');
    orders[idx] = { ...orders[idx], ...data, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },
};
