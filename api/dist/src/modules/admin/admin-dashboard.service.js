"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminDashboardService = class AdminDashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const [totalOrders, pendingOrders, deliveredOrders, ordersToday, totalCustomers, pendingPrescriptions, pendingPayments, lowStockProducts, totalRevenueResult, monthlyRevenueResult, recentOrders, revenueByMethod,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({
                where: {
                    orderStatus: {
                        in: [
                            'PENDING',
                            'PRESCRIPTION_REVIEW_PENDING',
                            'PAYMENT_VERIFICATION_PENDING',
                            'PROCESSING',
                            'PACKED',
                        ],
                    },
                },
            }),
            this.prisma.order.count({ where: { orderStatus: 'DELIVERED' } }),
            this.prisma.order.count({
                where: { placedAt: { gte: startOfDay } },
            }),
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            this.prisma.prescription.count({ where: { status: 'PENDING' } }),
            this.prisma.paymentSubmission.count({ where: { status: 'SUBMITTED' } }),
            this.prisma.product.count({
                where: { status: 'ACTIVE', stockQty: { lt: 10 } },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: { orderStatus: 'DELIVERED' },
            }),
            this.prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    orderStatus: 'DELIVERED',
                    placedAt: { gte: startOfMonth },
                },
            }),
            this.prisma.order.findMany({
                select: {
                    id: true,
                    orderNumber: true,
                    orderStatus: true,
                    paymentStatus: true,
                    paymentMethod: true,
                    total: true,
                    placedAt: true,
                    user: { select: { fullName: true, phone: true } },
                    _count: { select: { items: true } },
                },
                orderBy: { placedAt: 'desc' },
                take: 10,
            }),
            this.prisma.order.groupBy({
                by: ['paymentMethod'],
                _sum: { total: true },
                _count: true,
                where: { orderStatus: 'DELIVERED' },
            }),
        ]);
        return {
            totalOrders,
            pendingOrders,
            deliveredOrders,
            ordersToday,
            totalCustomers,
            pendingPrescriptions,
            pendingPayments,
            lowStockProducts,
            totalRevenue: Number(totalRevenueResult._sum.total ?? 0),
            salesThisMonth: Number(monthlyRevenueResult._sum.total ?? 0),
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                orderStatus: o.orderStatus,
                paymentStatus: o.paymentStatus,
                paymentMethod: o.paymentMethod,
                total: Number(o.total),
                itemCount: o._count.items,
                customerName: o.user.fullName,
                customerPhone: o.user.phone,
                placedAt: o.placedAt,
            })),
            revenueByPaymentMethod: revenueByMethod.map((r) => ({
                method: r.paymentMethod,
                revenue: Number(r._sum.total ?? 0),
                count: r._count,
            })),
        };
    }
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map