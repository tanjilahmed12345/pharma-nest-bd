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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
const ORDER_LIST_SELECT = {
    id: true,
    orderNumber: true,
    orderStatus: true,
    paymentStatus: true,
    paymentMethod: true,
    subtotal: true,
    deliveryFee: true,
    total: true,
    placedAt: true,
    createdAt: true,
    items: {
        select: {
            id: true,
            productNameSnapshot: true,
            imageSnapshot: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
        },
        take: 3,
    },
    _count: { select: { items: true } },
};
const ORDER_DETAIL_INCLUDE = {
    items: {
        select: {
            id: true,
            productId: true,
            productNameSnapshot: true,
            genericNameSnapshot: true,
            manufacturerSnapshot: true,
            strengthSnapshot: true,
            packSizeSnapshot: true,
            skuSnapshot: true,
            imageSnapshot: true,
            unitPrice: true,
            discountAmount: true,
            quantity: true,
            lineTotal: true,
            requiresPrescription: true,
        },
    },
    address: {
        select: {
            id: true,
            label: true,
            recipientName: true,
            phone: true,
            division: true,
            district: true,
            upazilaThana: true,
            area: true,
            addressLine: true,
            houseFlat: true,
        },
    },
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
    statusLogs: {
        select: {
            id: true,
            oldStatus: true,
            newStatus: true,
            note: true,
            createdAt: true,
            changedBy: { select: { id: true, fullName: true, role: true } },
        },
        orderBy: { createdAt: 'asc' },
    },
    payments: {
        select: {
            id: true,
            method: true,
            senderNumber: true,
            transactionId: true,
            amount: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    },
};
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserOrders(userId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.DEFAULT_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.status) {
            where.orderStatus = query.status;
        }
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                select: ORDER_LIST_SELECT,
                orderBy: { placedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            items: items.map(this.formatOrderListItem),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getUserOrderById(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: ORDER_DETAIL_INCLUDE,
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this order');
        }
        return this.formatOrderDetail(order);
    }
    async trackOrder(dto) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber: dto.orderNumber },
            include: {
                address: { select: { phone: true } },
                user: { select: { phone: true } },
                items: {
                    select: {
                        productNameSnapshot: true,
                        quantity: true,
                        lineTotal: true,
                    },
                },
                statusLogs: {
                    select: {
                        oldStatus: true,
                        newStatus: true,
                        note: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found. Please check your order number.');
        }
        const addressPhone = order.address?.phone;
        const userPhone = order.user?.phone;
        if (dto.phone !== addressPhone && dto.phone !== userPhone) {
            throw new common_1.NotFoundException('Order not found. Please check your order number and phone number.');
        }
        return {
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            total: Number(order.total),
            itemCount: order.items.length,
            items: order.items.map((i) => ({
                name: i.productNameSnapshot,
                quantity: i.quantity,
                lineTotal: Number(i.lineTotal),
            })),
            placedAt: order.placedAt,
            timeline: order.statusLogs.map((log) => ({
                from: log.oldStatus,
                to: log.newStatus,
                note: log.note,
                at: log.createdAt,
            })),
        };
    }
    async updateOrderStatus(orderId, dto, actorId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const statusTimestamps = this.getStatusTimestamp(dto.orderStatus);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: dto.orderStatus,
                    ...statusTimestamps,
                },
            });
            await tx.orderStatusLog.create({
                data: {
                    orderId,
                    oldStatus: order.orderStatus,
                    newStatus: dto.orderStatus,
                    note: dto.note ?? null,
                    changedById: actorId,
                },
            });
            return this.formatOrderListItem({
                ...updated,
                items: [],
                _count: { items: 0 },
            });
        });
    }
    getStatusTimestamp(status) {
        const now = new Date();
        switch (status) {
            case 'SHIPPED':
                return { shippedAt: now };
            case 'DELIVERED':
                return { deliveredAt: now };
            case 'CANCELLED':
                return { cancelledAt: now };
            default:
                return {};
        }
    }
    formatOrderListItem(order) {
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            subtotal: Number(order.subtotal),
            deliveryFee: Number(order.deliveryFee),
            total: Number(order.total),
            itemCount: order._count?.items ?? order.items?.length ?? 0,
            items: order.items?.map((i) => ({
                name: i.productNameSnapshot,
                image: i.imageSnapshot,
                quantity: i.quantity,
                unitPrice: Number(i.unitPrice),
                lineTotal: Number(i.lineTotal),
            })),
            placedAt: order.placedAt,
        };
    }
    formatOrderDetail(order) {
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
            items: order.items.map((i) => ({
                id: i.id,
                productId: i.productId,
                name: i.productNameSnapshot,
                genericName: i.genericNameSnapshot,
                manufacturer: i.manufacturerSnapshot,
                strength: i.strengthSnapshot,
                packSize: i.packSizeSnapshot,
                sku: i.skuSnapshot,
                image: i.imageSnapshot,
                unitPrice: Number(i.unitPrice),
                discountAmount: Number(i.discountAmount),
                quantity: i.quantity,
                lineTotal: Number(i.lineTotal),
                requiresPrescription: i.requiresPrescription,
            })),
            address: order.address,
            prescription: order.prescription,
            payments: order.payments?.map((p) => ({
                id: p.id,
                method: p.method,
                senderNumber: p.senderNumber,
                transactionId: p.transactionId,
                amount: Number(p.amount),
                status: p.status,
                createdAt: p.createdAt,
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map