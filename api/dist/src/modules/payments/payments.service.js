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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const verify_payment_dto_1 = require("./dto/verify-payment.dto");
const enums_1 = require("../../common/enums");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitPayment(userId, dto) {
        if (dto.method === enums_1.PaymentMethod.COD) {
            throw new common_1.BadRequestException('COD orders do not require payment submission');
        }
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('Order does not belong to you');
        }
        const submission = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.paymentSubmission.create({
                data: {
                    orderId: dto.orderId,
                    method: dto.method,
                    senderNumber: dto.senderNumber,
                    transactionId: dto.transactionId,
                    amount: dto.amount ?? Number(order.total),
                    paymentTime: dto.paymentTime ? new Date(dto.paymentTime) : null,
                    screenshotUrl: dto.screenshotUrl ?? null,
                    status: 'SUBMITTED',
                },
            });
            const shouldUpdateOrderStatus = order.orderStatus === 'PAYMENT_PENDING' ||
                order.orderStatus === 'PENDING';
            await tx.order.update({
                where: { id: dto.orderId },
                data: {
                    paymentStatus: 'SUBMITTED',
                    ...(shouldUpdateOrderStatus && {
                        orderStatus: 'PAYMENT_VERIFICATION_PENDING',
                    }),
                },
            });
            if (shouldUpdateOrderStatus) {
                await tx.orderStatusLog.create({
                    data: {
                        orderId: dto.orderId,
                        oldStatus: order.orderStatus,
                        newStatus: 'PAYMENT_VERIFICATION_PENDING',
                        note: `Payment submitted via ${dto.method}`,
                    },
                });
            }
            return payment;
        });
        return this.formatPayment(submission);
    }
    async getOrderPayments(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('Order does not belong to you');
        }
        const payments = await this.prisma.paymentSubmission.findMany({
            where: { orderId },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map(this.formatPayment);
    }
    async verifyPayment(id, dto, verifierId) {
        const payment = await this.prisma.paymentSubmission.findUnique({
            where: { id },
            include: {
                order: {
                    select: {
                        id: true,
                        orderStatus: true,
                        paymentStatus: true,
                        prescriptionId: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment submission not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.paymentSubmission.update({
                where: { id },
                data: {
                    status: dto.status === verify_payment_dto_1.VerifyStatus.VERIFIED ? 'VERIFIED' : 'REJECTED',
                    verificationNote: dto.verificationNote ?? null,
                    verifiedById: verifierId,
                    verifiedAt: new Date(),
                },
            });
            const order = payment.order;
            if (dto.status === verify_payment_dto_1.VerifyStatus.VERIFIED) {
                let newOrderStatus = order.orderStatus;
                if (order.orderStatus === 'PAYMENT_VERIFICATION_PENDING' ||
                    order.orderStatus === 'PRESCRIPTION_APPROVED') {
                    newOrderStatus = 'PROCESSING';
                }
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: 'VERIFIED',
                        orderStatus: newOrderStatus,
                    },
                });
                if (newOrderStatus !== order.orderStatus) {
                    await tx.orderStatusLog.create({
                        data: {
                            orderId: order.id,
                            oldStatus: order.orderStatus,
                            newStatus: newOrderStatus,
                            note: 'Payment verified',
                            changedById: verifierId,
                        },
                    });
                }
            }
            else {
                await tx.order.update({
                    where: { id: order.id },
                    data: { paymentStatus: 'REJECTED' },
                });
            }
            return this.formatPayment(updated);
        });
    }
    formatPayment(payment) {
        return {
            id: payment.id,
            orderId: payment.orderId,
            method: payment.method,
            senderNumber: payment.senderNumber,
            transactionId: payment.transactionId,
            amount: Number(payment.amount),
            paymentTime: payment.paymentTime,
            screenshotUrl: payment.screenshotUrl,
            status: payment.status,
            verificationNote: payment.verificationNote,
            verifiedAt: payment.verifiedAt,
            createdAt: payment.createdAt,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map