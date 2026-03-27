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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
const PRODUCT_INCLUDE = {
    category: { select: { id: true, name: true, slug: true } },
    brand: { select: { id: true, name: true, slug: true } },
    images: { orderBy: { sortOrder: 'asc' } },
    tags: { select: { tag: true } },
};
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchProducts(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.DEFAULT_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const q = query.q.trim();
        const where = {
            status: 'ACTIVE',
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { genericName: { contains: q, mode: 'insensitive' } },
                { manufacturerName: { contains: q, mode: 'insensitive' } },
                { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
                { brand: { name: { contains: q, mode: 'insensitive' } } },
            ],
        };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: PRODUCT_INCLUDE,
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map((p) => ({
                ...p,
                price: Number(p.price),
                discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                costPrice: p.costPrice ? Number(p.costPrice) : null,
                tags: p.tags?.map((t) => t.tag) ?? [],
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map