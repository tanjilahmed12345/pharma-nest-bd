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
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const CART_INCLUDE = {
    items: {
        include: {
            product: {
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    },
};
let CartsService = class CartsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.buildCartResponse(cart);
    }
    async addItem(userId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Product is not available');
        }
        if (dto.quantity > product.stockQty) {
            throw new common_1.BadRequestException(`Only ${product.stockQty} items available in stock`);
        }
        if (dto.quantity < product.minOrderQty) {
            throw new common_1.BadRequestException(`Minimum order quantity is ${product.minOrderQty}`);
        }
        if (dto.quantity > product.maxOrderQty) {
            throw new common_1.BadRequestException(`Maximum order quantity is ${product.maxOrderQty}`);
        }
        const unitPrice = product.discountPrice ?? product.price;
        const existingItem = await this.prisma.cartItem.findUnique({
            where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
        });
        if (existingItem) {
            const newQty = existingItem.quantity + dto.quantity;
            if (newQty > product.stockQty) {
                throw new common_1.BadRequestException(`Only ${product.stockQty} items available in stock (you already have ${existingItem.quantity} in cart)`);
            }
            if (newQty > product.maxOrderQty) {
                throw new common_1.BadRequestException(`Maximum order quantity is ${product.maxOrderQty}`);
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQty, unitPriceSnapshot: unitPrice },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                    unitPriceSnapshot: unitPrice,
                },
            });
        }
        return this.getCart(userId);
    }
    async updateItem(userId, itemId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        });
        if (!item || item.cartId !== cart.id) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (dto.quantity > item.product.stockQty) {
            throw new common_1.BadRequestException(`Only ${item.product.stockQty} items available in stock`);
        }
        if (dto.quantity > item.product.maxOrderQty) {
            throw new common_1.BadRequestException(`Maximum order quantity is ${item.product.maxOrderQty}`);
        }
        if (dto.quantity < item.product.minOrderQty) {
            throw new common_1.BadRequestException(`Minimum order quantity is ${item.product.minOrderQty}`);
        }
        const unitPrice = item.product.discountPrice ?? item.product.price;
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity, unitPriceSnapshot: unitPrice },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
        });
        if (!item || item.cartId !== cart.id) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({ where: { id: itemId } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        return { message: 'Cart cleared successfully' };
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: CART_INCLUDE,
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: CART_INCLUDE,
            });
        }
        return cart;
    }
    buildCartResponse(cart) {
        let subtotal = 0;
        let totalQuantity = 0;
        let hasPrescriptionItems = false;
        const items = cart.items.map((item) => {
            const unitPrice = Number(item.unitPriceSnapshot ?? item.product.discountPrice ?? item.product.price);
            const lineTotal = unitPrice * item.quantity;
            subtotal += lineTotal;
            totalQuantity += item.quantity;
            if (item.product.isPrescriptionRequired) {
                hasPrescriptionItems = true;
            }
            return {
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
                lineTotal,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    genericName: item.product.genericName,
                    strength: item.product.strength,
                    packSize: item.product.packSize,
                    price: Number(item.product.price),
                    discountPrice: item.product.discountPrice ? Number(item.product.discountPrice) : null,
                    stockQty: item.product.stockQty,
                    isPrescriptionRequired: item.product.isPrescriptionRequired,
                    status: item.product.status,
                    image: item.product.images?.[0]?.imageUrl ?? null,
                },
            };
        });
        return {
            id: cart.id,
            items,
            summary: {
                itemCount: items.length,
                totalQuantity,
                subtotal: Math.round(subtotal * 100) / 100,
                hasPrescriptionItems,
            },
        };
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartsService);
//# sourceMappingURL=carts.service.js.map