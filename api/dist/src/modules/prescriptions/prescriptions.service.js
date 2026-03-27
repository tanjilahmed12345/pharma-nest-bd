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
exports.PrescriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const review_prescription_dto_1 = require("./dto/review-prescription.dto");
const constants_1 = require("../../common/constants");
const PRESCRIPTION_INCLUDE = {
    orders: {
        select: { id: true, orderNumber: true, orderStatus: true },
        take: 5,
    },
    reviewedBy: {
        select: { id: true, fullName: true, role: true },
    },
    items: {
        include: {
            product: {
                select: { id: true, name: true, slug: true, genericName: true },
            },
        },
    },
};
let PrescriptionsService = class PrescriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPrescription(userId, dto) {
        if (dto.orderId) {
            const order = await this.prisma.order.findUnique({
                where: { id: dto.orderId },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.userId !== userId) {
                throw new common_1.ForbiddenException('Order does not belong to you');
            }
        }
        const prescription = await this.prisma.prescription.create({
            data: {
                userId,
                patientName: dto.patientName,
                doctorName: dto.doctorName,
                fileUrl: dto.fileUrl ?? null,
                fileName: dto.fileName ?? null,
                fileType: dto.fileType ?? null,
                issuedDate: dto.issuedDate ? new Date(dto.issuedDate) : null,
                notes: dto.notes ?? null,
                orderId: dto.orderId ?? null,
                status: 'PENDING',
            },
            include: PRESCRIPTION_INCLUDE,
        });
        return this.formatPrescription(prescription);
    }
    async getUserPrescriptions(userId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.DEFAULT_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (query.status) {
            where.status = query.status;
        }
        const [items, total] = await Promise.all([
            this.prisma.prescription.findMany({
                where,
                include: PRESCRIPTION_INCLUDE,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return {
            items: items.map(this.formatPrescription),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getUserPrescriptionById(userId, id) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: PRESCRIPTION_INCLUDE,
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this prescription');
        }
        return this.formatPrescription(prescription);
    }
    async reviewPrescription(id, dto, reviewerId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: { orders: { select: { id: true, orderStatus: true } } },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.prescription.update({
                where: { id },
                data: {
                    status: dto.status,
                    pharmacistNote: dto.pharmacistNote ?? null,
                    reviewedById: reviewerId,
                    reviewedAt: new Date(),
                },
                include: PRESCRIPTION_INCLUDE,
            });
            for (const order of prescription.orders) {
                if (order.orderStatus !== 'PRESCRIPTION_REVIEW_PENDING')
                    continue;
                let newOrderStatus;
                switch (dto.status) {
                    case review_prescription_dto_1.ReviewStatus.APPROVED:
                    case review_prescription_dto_1.ReviewStatus.PARTIALLY_APPROVED:
                        newOrderStatus = 'PRESCRIPTION_APPROVED';
                        break;
                    case review_prescription_dto_1.ReviewStatus.REJECTED:
                        newOrderStatus = 'PRESCRIPTION_REJECTED';
                        break;
                    case review_prescription_dto_1.ReviewStatus.NEEDS_CLARIFICATION:
                        continue;
                    default:
                        continue;
                }
                await tx.order.update({
                    where: { id: order.id },
                    data: { orderStatus: newOrderStatus },
                });
                await tx.orderStatusLog.create({
                    data: {
                        orderId: order.id,
                        oldStatus: order.orderStatus,
                        newStatus: newOrderStatus,
                        note: dto.pharmacistNote
                            ? `Prescription ${dto.status.toLowerCase()}: ${dto.pharmacistNote}`
                            : `Prescription ${dto.status.toLowerCase()}`,
                        changedById: reviewerId,
                    },
                });
            }
            return this.formatPrescription(updated);
        });
    }
    formatPrescription(prescription) {
        return {
            id: prescription.id,
            patientName: prescription.patientName,
            doctorName: prescription.doctorName,
            fileUrl: prescription.fileUrl,
            fileName: prescription.fileName,
            fileType: prescription.fileType,
            issuedDate: prescription.issuedDate,
            notes: prescription.notes,
            status: prescription.status,
            pharmacistNote: prescription.pharmacistNote,
            reviewedBy: prescription.reviewedBy
                ? {
                    name: prescription.reviewedBy.fullName,
                    role: prescription.reviewedBy.role,
                }
                : null,
            reviewedAt: prescription.reviewedAt,
            orders: prescription.orders ?? [],
            items: prescription.items?.map((item) => ({
                id: item.id,
                requestedQty: item.requestedQty,
                approvedQty: item.approvedQty,
                status: item.status,
                note: item.note,
                product: item.product,
            })) ?? [],
            createdAt: prescription.createdAt,
            updatedAt: prescription.updatedAt,
        };
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map