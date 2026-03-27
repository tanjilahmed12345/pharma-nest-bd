import { AdminDashboardService } from './admin-dashboard.service';
export declare class AdminDashboardController {
    private dashboardService;
    constructor(dashboardService: AdminDashboardService);
    getDashboard(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        ordersToday: number;
        totalCustomers: number;
        pendingPrescriptions: number;
        pendingPayments: number;
        lowStockProducts: number;
        totalRevenue: number;
        salesThisMonth: number;
        recentOrders: {
            id: string;
            orderNumber: string;
            orderStatus: import("@prisma/client").$Enums.OrderStatus;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            total: number;
            itemCount: number;
            customerName: string;
            customerPhone: string;
            placedAt: Date;
        }[];
        revenueByPaymentMethod: {
            method: import("@prisma/client").$Enums.PaymentMethod;
            revenue: number;
            count: number;
        }[];
    }>;
}
