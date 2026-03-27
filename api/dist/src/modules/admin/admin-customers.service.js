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
exports.AdminCustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let AdminCustomersService = class AdminCustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCustomers(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.DEFAULT_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = { role: 'CUSTOMER' };
        if (query.q) {
            where.OR = [
                { fullName: { contains: query.q, mode: 'insensitive' } },
                { email: { contains: query.q, mode: 'insensitive' } },
                { phone: { contains: query.q } },
            ];
        }
        const [customers, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    lastLoginAt: true,
                    orders: {
                        select: { total: true, placedAt: true },
                        orderBy: { placedAt: 'desc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        const items = customers.map((c) => ({
            id: c.id,
            fullName: c.fullName,
            email: c.email,
            phone: c.phone,
            role: c.role,
            status: c.status,
            totalOrders: c.orders.length,
            totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
            lastOrderAt: c.orders[0]?.placedAt ?? null,
            createdAt: c.createdAt,
            lastLoginAt: c.lastLoginAt,
        }));
        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.AdminCustomersService = AdminCustomersService;
exports.AdminCustomersService = AdminCustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminCustomersService);
//# sourceMappingURL=admin-customers.service.js.map