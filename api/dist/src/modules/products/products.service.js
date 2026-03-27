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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const product_query_dto_1 = require("./dto/product-query.dto");
const constants_1 = require("../../common/constants");
const PUBLIC_PRODUCT_INCLUDE = {
    category: { select: { id: true, name: true, slug: true } },
    brand: { select: { id: true, name: true, slug: true } },
    images: { orderBy: { sortOrder: 'asc' } },
    tags: { select: { tag: true } },
};
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? constants_1.DEFAULT_PAGE_SIZE;
        const skip = (page - 1) * limit;
        const where = this.buildPublicWhere(query);
        const orderBy = this.buildOrderBy(query.sort);
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: PUBLIC_PRODUCT_INCLUDE,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map(this.formatProduct),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getProductBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                ...PUBLIC_PRODUCT_INCLUDE,
                alternatives: {
                    include: {
                        alternative: {
                            include: {
                                images: { where: { isPrimary: true }, take: 1 },
                            },
                        },
                    },
                    take: 6,
                },
            },
        });
        if (!product || product.status !== 'ACTIVE') {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.formatProductDetail(product);
    }
    async getFeaturedProducts(limit = 12) {
        const items = await this.prisma.product.findMany({
            where: { status: 'ACTIVE', isFeatured: true },
            include: PUBLIC_PRODUCT_INCLUDE,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return items.map(this.formatProduct);
    }
    async getOfferProducts(page = 1, limit = constants_1.DEFAULT_PAGE_SIZE) {
        const skip = (page - 1) * limit;
        const where = {
            status: 'ACTIVE',
            discountPrice: { not: null },
        };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: PUBLIC_PRODUCT_INCLUDE,
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map(this.formatProduct),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOtcProducts(page = 1, limit = constants_1.DEFAULT_PAGE_SIZE) {
        const skip = (page - 1) * limit;
        const where = {
            status: 'ACTIVE',
            isPrescriptionRequired: false,
        };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: PUBLIC_PRODUCT_INCLUDE,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map(this.formatProduct),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getRxProducts(page = 1, limit = constants_1.DEFAULT_PAGE_SIZE) {
        const skip = (page - 1) * limit;
        const where = {
            status: 'ACTIVE',
            isPrescriptionRequired: true,
        };
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: PUBLIC_PRODUCT_INCLUDE,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items: items.map(this.formatProduct),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getRelatedProducts(slug, limit = 8) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            select: { id: true, categoryId: true, brandId: true, genericName: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const items = await this.prisma.product.findMany({
            where: {
                status: 'ACTIVE',
                id: { not: product.id },
                OR: [
                    { categoryId: product.categoryId },
                    ...(product.brandId ? [{ brandId: product.brandId }] : []),
                    { genericName: { contains: product.genericName, mode: 'insensitive' } },
                ],
            },
            include: PUBLIC_PRODUCT_INCLUDE,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return items.map(this.formatProduct);
    }
    async createProduct(dto) {
        const existing = await this.prisma.product.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('A product with this slug already exists');
        }
        await this.validateCategoryAndBrand(dto.categoryId, dto.brandId);
        this.validatePricing(dto.price, dto.discountPrice);
        const { images, tags, ...productData } = dto;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                images: images?.length
                    ? { createMany: { data: images } }
                    : undefined,
                tags: tags?.length
                    ? { createMany: { data: tags.map((tag) => ({ tag })) } }
                    : undefined,
            },
            include: PUBLIC_PRODUCT_INCLUDE,
        });
        return this.formatProduct(product);
    }
    async updateProduct(id, dto) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (dto.slug && dto.slug !== product.slug) {
            const existing = await this.prisma.product.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('A product with this slug already exists');
            }
        }
        if (dto.categoryId || dto.brandId) {
            await this.validateCategoryAndBrand(dto.categoryId ?? product.categoryId, dto.brandId ?? product.brandId);
        }
        const effectivePrice = dto.price ?? Number(product.price);
        const effectiveDiscount = dto.discountPrice ?? (product.discountPrice ? Number(product.discountPrice) : undefined);
        this.validatePricing(effectivePrice, effectiveDiscount);
        const { images, tags, ...productData } = dto;
        return this.prisma.$transaction(async (tx) => {
            if (images !== undefined) {
                await tx.productImage.deleteMany({ where: { productId: id } });
                if (images.length > 0) {
                    await tx.productImage.createMany({
                        data: images.map((img) => ({ ...img, productId: id })),
                    });
                }
            }
            if (tags !== undefined) {
                await tx.productTag.deleteMany({ where: { productId: id } });
                if (tags.length > 0) {
                    await tx.productTag.createMany({
                        data: tags.map((tag) => ({ tag, productId: id })),
                    });
                }
            }
            const updated = await tx.product.update({
                where: { id },
                data: productData,
                include: PUBLIC_PRODUCT_INCLUDE,
            });
            return this.formatProduct(updated);
        });
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({ where: { id } });
        return { message: 'Product deleted successfully' };
    }
    async toggleActive(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const updated = await this.prisma.product.update({
            where: { id },
            data: { status: newStatus },
            include: PUBLIC_PRODUCT_INCLUDE,
        });
        return this.formatProduct(updated);
    }
    async toggleFeatured(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const updated = await this.prisma.product.update({
            where: { id },
            data: { isFeatured: !product.isFeatured },
            include: PUBLIC_PRODUCT_INCLUDE,
        });
        return this.formatProduct(updated);
    }
    buildPublicWhere(query) {
        const where = { status: 'ACTIVE' };
        const andConditions = [];
        if (query.q) {
            andConditions.push({
                OR: [
                    { name: { contains: query.q, mode: 'insensitive' } },
                    { genericName: { contains: query.q, mode: 'insensitive' } },
                    { manufacturerName: { contains: query.q, mode: 'insensitive' } },
                    { tags: { some: { tag: { contains: query.q, mode: 'insensitive' } } } },
                ],
            });
        }
        if (query.categorySlug) {
            andConditions.push({
                category: { slug: query.categorySlug },
            });
        }
        if (query.brandSlug) {
            andConditions.push({
                brand: { slug: query.brandSlug },
            });
        }
        if (query.prescriptionRequired !== undefined) {
            andConditions.push({
                isPrescriptionRequired: query.prescriptionRequired,
            });
        }
        if (query.inStock === true) {
            andConditions.push({ stockQty: { gt: 0 } });
        }
        if (query.dosageForm) {
            andConditions.push({ dosageForm: query.dosageForm });
        }
        if (query.minPrice !== undefined) {
            andConditions.push({ price: { gte: query.minPrice } });
        }
        if (query.maxPrice !== undefined) {
            andConditions.push({ price: { lte: query.maxPrice } });
        }
        if (query.featured === true) {
            andConditions.push({ isFeatured: true });
        }
        if (query.hasDiscount === true) {
            andConditions.push({ discountPrice: { not: null } });
        }
        if (andConditions.length > 0) {
            where.AND = andConditions;
        }
        return where;
    }
    buildOrderBy(sort) {
        switch (sort) {
            case product_query_dto_1.ProductSort.PRICE_ASC:
                return [{ price: 'asc' }];
            case product_query_dto_1.ProductSort.PRICE_DESC:
                return [{ price: 'desc' }];
            case product_query_dto_1.ProductSort.NAME_ASC:
                return [{ name: 'asc' }];
            case product_query_dto_1.ProductSort.LATEST:
            default:
                return [{ createdAt: 'desc' }];
        }
    }
    async validateCategoryAndBrand(categoryId, brandId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found');
        }
        if (brandId) {
            const brand = await this.prisma.brand.findUnique({
                where: { id: brandId },
            });
            if (!brand) {
                throw new common_1.BadRequestException('Brand not found');
            }
        }
    }
    validatePricing(price, discountPrice) {
        if (discountPrice !== undefined && discountPrice !== null && discountPrice > price) {
            throw new common_1.BadRequestException('Discount price cannot exceed regular price');
        }
    }
    formatProduct(product) {
        return {
            ...product,
            price: Number(product.price),
            discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
            costPrice: product.costPrice ? Number(product.costPrice) : null,
            tags: product.tags?.map((t) => t.tag) ?? [],
        };
    }
    formatProductDetail(product) {
        const formatted = this.formatProduct(product);
        if (formatted.alternatives) {
            formatted.alternatives = formatted.alternatives.map((alt) => ({
                id: alt.alternative.id,
                name: alt.alternative.name,
                slug: alt.alternative.slug,
                price: Number(alt.alternative.price),
                discountPrice: alt.alternative.discountPrice
                    ? Number(alt.alternative.discountPrice)
                    : null,
                image: alt.alternative.images?.[0]?.imageUrl ?? null,
            }));
        }
        return formatted;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map