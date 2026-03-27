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
exports.AdminPrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_prescription_query_dto_1 = require("./dto/admin-prescription-query.dto");
const review_prescription_dto_1 = require("../prescriptions/dto/review-prescription.dto");
const prescriptions_service_1 = require("../prescriptions/prescriptions.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let AdminPrescriptionsController = class AdminPrescriptionsController {
    prescriptionsService;
    prisma;
    constructor(prescriptionsService, prisma) {
        this.prescriptionsService = prescriptionsService;
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
        if (query.q) {
            andConditions.push({
                OR: [
                    { patientName: { contains: query.q, mode: 'insensitive' } },
                    { user: { fullName: { contains: query.q, mode: 'insensitive' } } },
                    { orders: { some: { orderNumber: { contains: query.q, mode: 'insensitive' } } } },
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
            this.prisma.prescription.findMany({
                where,
                select: {
                    id: true,
                    patientName: true,
                    doctorName: true,
                    issuedDate: true,
                    status: true,
                    fileUrl: true,
                    createdAt: true,
                    reviewedAt: true,
                    user: { select: { fullName: true, email: true, phone: true } },
                    orders: { select: { orderNumber: true }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.prescription.count({ where }),
        ]);
        return {
            items: items.map((p) => ({
                id: p.id,
                patientName: p.patientName,
                doctorName: p.doctorName,
                issuedDate: p.issuedDate,
                status: p.status,
                fileUrl: p.fileUrl,
                customerName: p.user.fullName,
                customerPhone: p.user.phone,
                orderNumber: p.orders[0]?.orderNumber ?? null,
                createdAt: p.createdAt,
                reviewedAt: p.reviewedAt,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, fullName: true, email: true, phone: true } },
                reviewedBy: { select: { id: true, fullName: true, role: true } },
                orders: { select: { id: true, orderNumber: true, orderStatus: true } },
                items: {
                    include: {
                        product: { select: { id: true, name: true, slug: true, genericName: true } },
                    },
                },
            },
        });
        if (!prescription)
            throw new Error('Prescription not found');
        return prescription;
    }
    async review(id, dto, user) {
        return this.prescriptionsService.reviewPrescription(id, dto, user.sub);
    }
};
exports.AdminPrescriptionsController = AdminPrescriptionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all prescriptions (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_prescription_query_dto_1.AdminPrescriptionQueryDto]),
    __metadata("design:returntype", Promise)
], AdminPrescriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription detail (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPrescriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, swagger_1.ApiOperation)({ summary: 'Review prescription (admin/pharmacist)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription reviewed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_prescription_dto_1.ReviewPrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], AdminPrescriptionsController.prototype, "review", null);
exports.AdminPrescriptionsController = AdminPrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.PHARMACIST),
    (0, common_1.Controller)('admin/prescriptions'),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService,
        prisma_service_1.PrismaService])
], AdminPrescriptionsController);
//# sourceMappingURL=admin-prescriptions.controller.js.map