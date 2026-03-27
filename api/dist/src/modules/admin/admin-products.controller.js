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
exports.AdminProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("../products/products.service");
const create_product_dto_1 = require("../products/dto/create-product.dto");
const update_product_dto_1 = require("../products/dto/update-product.dto");
const admin_product_query_dto_1 = require("./dto/admin-product-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("../../common/constants");
let AdminProductsController = class AdminProductsController {
    productsService;
    prisma;
    constructor(productsService, prisma) {
        this.productsService = productsService;
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
                    { name: { contains: query.q, mode: 'insensitive' } },
                    { genericName: { contains: query.q, mode: 'insensitive' } },
                    { sku: { contains: query.q, mode: 'insensitive' } },
                ],
            });
        }
        if (query.status)
            andConditions.push({ status: query.status });
        if (query.categoryId)
            andConditions.push({ categoryId: query.categoryId });
        if (query.brandId)
            andConditions.push({ brandId: query.brandId });
        if (query.featured !== undefined)
            andConditions.push({ isFeatured: query.featured });
        if (query.prescriptionRequired !== undefined) {
            andConditions.push({ isPrescriptionRequired: query.prescriptionRequired });
        }
        if (query.lowStock)
            andConditions.push({ stockQty: { lt: 10 } });
        if (andConditions.length > 0)
            where.AND = andConditions;
        const orderBy = this.buildSort(query.sort);
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    brand: { select: { id: true, name: true, slug: true } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                genericName: p.genericName,
                category: p.category,
                brand: p.brand,
                price: Number(p.price),
                discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
                stockQty: p.stockQty,
                status: p.status,
                isFeatured: p.isFeatured,
                isPrescriptionRequired: p.isPrescriptionRequired,
                image: p.images?.[0]?.imageUrl ?? null,
                createdAt: p.createdAt,
            })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                brand: { select: { id: true, name: true, slug: true } },
                images: { orderBy: { sortOrder: 'asc' } },
                tags: { select: { tag: true } },
                alternatives: {
                    include: {
                        alternative: { select: { id: true, name: true, slug: true } },
                    },
                },
            },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return {
            ...product,
            price: Number(product.price),
            discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
            costPrice: product.costPrice ? Number(product.costPrice) : null,
            tags: product.tags.map((t) => t.tag),
            alternatives: product.alternatives.map((a) => a.alternative),
        };
    }
    async create(dto) {
        return this.productsService.createProduct(dto);
    }
    async update(id, dto) {
        return this.productsService.updateProduct(id, dto);
    }
    async remove(id) {
        return this.productsService.deleteProduct(id);
    }
    async toggleActive(id) {
        return this.productsService.toggleActive(id);
    }
    async toggleFeatured(id) {
        return this.productsService.toggleFeatured(id);
    }
    buildSort(sort) {
        switch (sort) {
            case admin_product_query_dto_1.AdminProductSort.NAME_ASC:
                return [{ name: 'asc' }];
            case admin_product_query_dto_1.AdminProductSort.PRICE_ASC:
                return [{ price: 'asc' }];
            case admin_product_query_dto_1.AdminProductSort.PRICE_DESC:
                return [{ price: 'desc' }];
            case admin_product_query_dto_1.AdminProductSort.STOCK_ASC:
                return [{ stockQty: 'asc' }];
            case admin_product_query_dto_1.AdminProductSort.STOCK_DESC:
                return [{ stockQty: 'desc' }];
            default:
                return [{ createdAt: 'desc' }];
        }
    }
};
exports.AdminProductsController = AdminProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all products (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_product_query_dto_1.AdminProductQueryDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product detail for editing (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create product (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle product active/inactive (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle product featured (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "toggleFeatured", null);
exports.AdminProductsController = AdminProductsController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin/products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        prisma_service_1.PrismaService])
], AdminProductsController);
//# sourceMappingURL=admin-products.controller.js.map