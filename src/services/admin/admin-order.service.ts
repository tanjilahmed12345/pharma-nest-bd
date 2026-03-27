import { orderRepository } from '@/repositories';
import { Order, OrderStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const adminOrderService = {
  getAllOrders(): Promise<Order[]> {
    return orderRepository.getAll();
  },

  async getOrderById(id: string): Promise<Order> {
    const order = await orderRepository.getById(id);
    if (!order) throw AppError.notFound('Order');
    return order;
  },

  updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    return orderRepository.updateStatus(id, status, note);
  },

  /**
   * Filter orders by status.
   */
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const all = await orderRepository.getAll();
    return all.filter((o) => o.orderStatus === status);
  },
};
