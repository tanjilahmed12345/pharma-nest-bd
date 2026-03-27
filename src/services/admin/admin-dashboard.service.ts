import { orderRepository, productRepository, prescriptionRepository, paymentRepository, userRepository } from '@/repositories';
import {
  DashboardStats,
  OrderStatus,
  PrescriptionStatus,
  PaymentStatus,
  UserRole,
} from '@/types';

const LOW_STOCK_THRESHOLD = 20;

export const adminDashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const [orders, prescriptions, payments, users] = await Promise.all([
      orderRepository.getAll(),
      prescriptionRepository.getAll(),
      paymentRepository.getAll(),
      userRepository.getAll(),
    ]);

    // Get all products (unfiltered) via paginated response
    const productResult = await productRepository.getAll({ pageSize: 9999 });
    const allProducts = productResult.data;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const totalOrders = orders.length;

    const totalRevenue = orders
      .filter((o) => o.orderStatus === OrderStatus.DELIVERED)
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(
      (o) =>
        o.orderStatus === OrderStatus.PENDING ||
        o.orderStatus === OrderStatus.PRESCRIPTION_REVIEW_PENDING
    ).length;

    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === OrderStatus.DELIVERED
    ).length;

    const pendingPrescriptions = prescriptions.filter(
      (p) => p.status === PrescriptionStatus.PENDING
    ).length;

    const pendingPayments = payments.filter(
      (p) =>
        p.status === PaymentStatus.PENDING || p.status === PaymentStatus.SUBMITTED
    ).length;

    const lowStockProducts = allProducts.filter(
      (p) => p.isActive && p.stockQty <= LOW_STOCK_THRESHOLD && p.stockQty > 0
    );

    const recentOrders = orders.slice(0, 10);

    const ordersThisMonth = orders.filter(
      (o) => o.createdAt >= startOfMonth
    ).length;

    const salesThisMonth = orders
      .filter(
        (o) =>
          o.createdAt >= startOfMonth &&
          o.orderStatus === OrderStatus.DELIVERED
      )
      .reduce((sum, o) => sum + o.total, 0);

    const totalCustomers = users.filter(
      (u) => u.role === UserRole.CUSTOMER
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      pendingPrescriptions,
      pendingPayments,
      lowStockProducts,
      recentOrders,
      salesThisMonth,
      ordersThisMonth,
      totalCustomers,
    };
  },
};
