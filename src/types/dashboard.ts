import { Order } from './order';
import { Product } from './product';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  pendingPrescriptions: number;
  pendingPayments: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
  salesThisMonth: number;
  ordersThisMonth: number;
  totalCustomers: number;
}
