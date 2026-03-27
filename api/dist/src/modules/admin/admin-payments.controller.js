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
exports.AdminPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_payment_query_dto_1 = require("./dto/admin-payment-query.dto");
const verify_payment_dto_1 = require("../payments/dto/verify-payment.dto");
const payments_service_1 = require("../payments/payments.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let AdminPaymentsController = class AdminPaymentsController {
    paymentsService;
    prisma;
    constructor(paymentsService, prisma) {
        this.paymentsService = paymentsService;
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.ADMIN_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = {};
        const andConditions = [];
        if (query.status)
            andConditions.push({ status: query.status });
        if (query.method)
            andConditions.push({ method: query.method });
        if (query.q) {
            andConditions.push({
                OR: [
                    { order: { orderNumber: { contains: query.q, mode: 'insensitive' } } },
                    { senderNumber: { contains: query.q } },
                    { transactionId: { contains: query.q, mode: 'insensitive' } },
                ],
            });
        }
        if (query.fromDate)
            andConditions.push({ createdAt: { gte: new Date(query.fromDate) } });
        if (query.toDate)
            andConditions.push({ createdAt: { lte: new Date(query.toDate) } });
        if (andConditions.length > 0)
            where.AND = andConditions;
        const [items, total] = await Promise.all([
            this.prisma.paymentSubmission.findMany({
                where,
                select: {
                    id: true,
                    method: true,
                    senderNumber: true,
                    transactionId: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                    order: {
                        select: {
                            orderNumber: true,
                            user: { select: { fullName: true, phone: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.paymentSubmission.count({ where }),
        ]);
        return {
            items: items.map((p) => ({
                id: p.id,
                method: p.method,
                senderNumber: p.senderNumber,
                transactionId: p.transactionId,
                amount: Number(p.amount),
                status: p.status,
                orderNumber: p.order.orderNumber,
                customerName: p.order.user.fullName,
                customerPhone: p.order.user.phone,
                createdAt: p.createdAt,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const payment = await this.prisma.paymentSubmission.findUnique({
            where: { id },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        orderStatus: true,
                        paymentStatus: true,
                        total: true,
                        user: { select: { id: true, fullName: true, email: true, phone: true } },
                    },
                },
                verifiedBy: { select: { id: true, fullName: true, role: true } },
            },
        });
        if (!payment)
            throw new Error('Payment not found');
        return {
            ...payment,
            amount: Number(payment.amount),
            order: {
                ...payment.order,
                total: Number(payment.order.total),
            },
        };
    }
    async verify(id, dto, user) {
        return this.paymentsService.verifyPayment(id, dto, user.sub);
    }
};
exports.AdminPaymentsController = AdminPaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all payment submissions (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_payment_query_dto_1.AdminPaymentQueryDto]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment detail (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify or reject payment (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verified/rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_payment_dto_1.VerifyPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "verify", null);
exports.AdminPaymentsController = AdminPaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.STAFF),
    (0, common_1.Controller)('admin/payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        prisma_service_1.PrismaService])
], AdminPaymentsController);
//# sourceMappingURL=admin-payments.controller.js.map