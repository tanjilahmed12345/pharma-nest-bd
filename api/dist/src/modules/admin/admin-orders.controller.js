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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_order_query_dto_1 = require("./dto/admin-order-query.dto");
const update_admin_note_dto_1 = require("./dto/update-admin-note.dto");
const update_order_status_dto_1 = require("../orders/dto/update-order-status.dto");
const orders_service_1 = require("../orders/orders.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let AdminOrdersController = class AdminOrdersController {
    ordersService;
    prisma;
    constructor(ordersService, prisma) {
        this.ordersService = ordersService;
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.ADMIN_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = {};
        const andConditions = [];
        if (query.q) {
            andConditions.push({
                OR: [
                    { orderNumber: { contains: query.q, mode: 'insensitive' } },
                    { user: { fullName: { contains: query.q, mode: 'insensitive' } } },
                    { user: { phone: { contains: query.q } } },
                ],
            });
        }
        if (query.orderStatus)
            andConditions.push({ orderStatus: query.orderStatus });
        if (query.paymentStatus)
            andConditions.push({ paymentStatus: query.paymentStatus });
        if (query.paymentMethod)
            andConditions.push({ paymentMethod: query.paymentMethod });
        if (query.fromDate)
            andConditions.push({ placedAt: { gte: new Date(query.fromDate) } });
        if (query.toDate)
            andConditions.push({ placedAt: { lte: new Date(query.toDate) } });
        if (andConditions.length > 0)
            where.AND = andConditions;
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
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
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            items: items.map((o) => ({
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
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, fullName: true, email: true, phone: true } },
                items: true,
                address: true,
                prescription: {
                    select: {
                        id: true,
                        patientName: true,
                        doctorName: true,
                        status: true,
                        pharmacistNote: true,
                        fileUrl: true,
                    },
                },
                payments: { orderBy: { createdAt: 'desc' } },
                statusLogs: {
                    include: {
                        changedBy: { select: { id: true, fullName: true, role: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!order)
            throw new Error('Order not found');
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            subtotal: Number(order.subtotal),
            discountTotal: Number(order.discountTotal),
            deliveryFee: Number(order.deliveryFee),
            total: Number(order.total),
            currency: order.currency,
            customerNote: order.customerNote,
            adminNote: order.adminNote,
            placedAt: order.placedAt,
            approvedAt: order.approvedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt,
            cancelledAt: order.cancelledAt,
            customer: order.user,
            address: order.address,
            prescription: order.prescription,
            items: order.items.map((i) => ({
                ...i,
                unitPrice: Number(i.unitPrice),
                discountAmount: Number(i.discountAmount),
                lineTotal: Number(i.lineTotal),
            })),
            payments: order.payments.map((p) => ({
                ...p,
                amount: Number(p.amount),
            })),
            timeline: order.statusLogs.map((log) => ({
                id: log.id,
                from: log.oldStatus,
                to: log.newStatus,
                note: log.note,
                at: log.createdAt,
                changedBy: log.changedBy
                    ? { name: log.changedBy.fullName, role: log.changedBy.role }
                    : null,
            })),
        };
    }
    async updateStatus(id, dto, user) {
        return this.ordersService.updateOrderStatus(id, dto, user.sub);
    }
    async updateNote(id, dto) {
        return this.prisma.order.update({
            where: { id },
            data: { adminNote: dto.adminNote },
            select: { id: true, orderNumber: true, adminNote: true },
        });
    }
};
exports.AdminOrdersController = AdminOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all orders (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_order_query_dto_1.AdminOrderQueryDto]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full order detail (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/note'),
    (0, swagger_1.ApiOperation)({ summary: 'Update admin note on order' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_note_dto_1.UpdateAdminNoteDto]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "updateNote", null);
exports.AdminOrdersController = AdminOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.STAFF),
    (0, common_1.Controller)('admin/orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        prisma_service_1.PrismaService])
], AdminOrdersController);
//# sourceMappingURL=admin-orders.controller.js.map