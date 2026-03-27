import { orderRepository } from '@/repositories';
import { Order, OrderStatus } from '@/types';
import { AppError } from '@/lib/utils/app-error';

export const orderService = {
  getOrders(userId?: string): Promise<Order[]> {
    return orderRepository.getAll(userId);
  },

  async getOrderById(id: string): Promise<Order> {
    const order = await orderRepository.getById(id);
    if (!order) throw AppError.notFound('Order');
    return order;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await orderRepository.getByOrderNumber(orderNumber);
    if (!order) throw AppError.notFound('Order');
    return order;
  },

  /**
   * Track order by order number and phone (mock: just looks up by order number).
   */
  async trackOrder(orderNumber: string, _phone: string): Promise<Order> {
    const order = await orderRepository.getByOrderNumber(orderNumber);
    if (!order) {
      throw AppError.notFound('Order');
    }
    return order;
  },

  updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    return orderRepository.updateStatus(id, status, note);
  },

  /**
   * Reorder: returns the item list from a previous order so it can be added to cart.
   */
  async getReorderItems(orderId: string) {
    const order = await orderRepository.getById(orderId);
    if (!order) throw AppError.notFound('Order');
    return order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
  },
};
