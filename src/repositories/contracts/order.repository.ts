import { Order, OrderStatus } from '@/types';

export interface IOrderRepository {
  getAll(userId?: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  getByOrderNumber(orderNumber: string): Promise<Order | null>;
  create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateStatus(id: string, status: OrderStatus, note?: string): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<Order>;
}
