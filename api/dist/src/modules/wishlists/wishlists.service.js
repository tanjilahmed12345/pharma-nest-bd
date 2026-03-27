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
exports.WishlistsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const WISHLIST_INCLUDE = {
    items: {
        include: {
            product: {
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    category: { select: { id: true, name: true, slug: true } },
                    brand: { select: { id: true, name: true, slug: true } },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    },
};
let WishlistsService = class WishlistsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        const wishlist = await this.getOrCreateWishlist(userId);
        return this.buildWishlistResponse(wishlist);
    }
    async addItem(userId, productId) {
        const wishlist = await this.getOrCreateWishlist(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product || product.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Product is not available');
        }
        const existing = await this.prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Product is already in your wishlist');
        }
        await this.prisma.wishlistItem.create({
            data: { wishlistId: wishlist.id, productId },
        });
        return this.getWishlist(userId);
    }
    async removeItem(userId, productId) {
        const wishlist = await this.getOrCreateWishlist(userId);
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId,
                },
            },
        });
        if (!item) {
            throw new common_1.BadRequestException('Product is not in your wishlist');
        }
        await this.prisma.wishlistItem.delete({ where: { id: item.id } });
        return this.getWishlist(userId);
    }
    async isInWishlist(userId, productId) {
        const wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
        });
        if (!wishlist)
            return { inWishlist: false };
        const item = await this.prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId,
                },
            },
        });
        return { inWishlist: !!item };
    }
    async getOrCreateWishlist(userId) {
        let wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
            include: WISHLIST_INCLUDE,
        });
        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({
                data: { userId },
                include: WISHLIST_INCLUDE,
            });
        }
        return wishlist;
    }
    buildWishlistResponse(wishlist) {
        const items = wishlist.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            addedAt: item.createdAt,
            product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                genericName: item.product.genericName,
                strength: item.product.strength,
                packSize: item.product.packSize,
                price: Number(item.product.price),
                discountPrice: item.product.discountPrice
                    ? Number(item.product.discountPrice)
                    : null,
                stockQty: item.product.stockQty,
                isPrescriptionRequired: item.product.isPrescriptionRequired,
                status: item.product.status,
                image: item.product.images?.[0]?.imageUrl ?? null,
                category: item.product.category,
                brand: item.product.brand,
            },
        }));
        return {
            id: wishlist.id,
            items,
            itemCount: items.length,
        };
    }
};
exports.WishlistsService = WishlistsService;
exports.WishlistsService = WishlistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistsService);
//# sourceMappingURL=wishlists.service.js.map