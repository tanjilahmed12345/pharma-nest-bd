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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
const utils_1 = require("../../common/utils");
let CheckoutService = class CheckoutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async preview(userId, dto) {
        const cart = await this.getCartWithProducts(userId);
        if (cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const address = await this.validateAddress(userId, dto.addressId);
        const settings = await this.getSettings();
        await this.validatePaymentMethod(dto.paymentMethod, settings);
        const { items, subtotal, discountTotal, hasPrescriptionItems } = this.calculateItemTotals(cart.items);
        const deliveryFee = this.calculateDeliveryFee(address.district, subtotal, settings);
        const total = subtotal - discountTotal + deliveryFee;
        const warnings = [];
        const stockWarnings = this.checkStockAvailability(cart.items);
        warnings.push(...stockWarnings);
        if (hasPrescriptionItems && !dto.prescriptionId) {
            warnings.push('Your cart contains prescription-required items. A valid prescription must be provided to complete the order.');
        }
        if (dto.prescriptionId) {
            await this.validatePrescription(userId, dto.prescriptionId);
        }
        return {
            items,
            address: {
                id: address.id,
                label: address.label,
                recipientName: address.recipientName,
                phone: address.phone,
                division: address.division,
                district: address.district,
                upazilaThana: address.upazilaThana,
                area: address.area,
                addressLine: address.addressLine,
            },
            paymentMethod: dto.paymentMethod,
            summary: {
                itemCount: items.length,
                totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
                subtotal: this.round(subtotal),
                discountTotal: this.round(discountTotal),
                deliveryFee: this.round(deliveryFee),
                total: this.round(total),
                hasPrescriptionItems,
                prescriptionLinked: !!dto.prescriptionId,
            },
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
    async placeOrder(userId, dto) {
        const cart = await this.getCartWithProducts(userId);
        if (cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const address = await this.validateAddress(userId, dto.addressId);
        const settings = await this.getSettings();
        await this.validatePaymentMethod(dto.paymentMethod, settings);
        const { subtotal, discountTotal, hasPrescriptionItems, orderItems } = this.buildOrderItems(cart.items);
        const stockIssues = this.checkStockAvailability(cart.items);
        if (stockIssues.length > 0) {
            throw new common_1.BadRequestException(stockIssues[0]);
        }
        if (hasPrescriptionItems && !dto.prescriptionId) {
            throw new common_1.BadRequestException('A prescription is required for one or more items in your cart');
        }
        if (dto.prescriptionId) {
            await this.validatePrescription(userId, dto.prescriptionId);
        }
        if (dto.paymentMethod !== enums_1.PaymentMethod.COD && dto.paymentInput) {
            if (!dto.paymentInput.transactionId) {
                throw new common_1.BadRequestException('Transaction ID is required for mobile wallet payments');
            }
        }
        const deliveryFee = this.calculateDeliveryFee(address.district, subtotal, settings);
        const total = subtotal - discountTotal + deliveryFee;
        const orderNumber = (0, utils_1.generateOrderNumber)();
        const { orderStatus, paymentStatus } = this.determineInitialStatuses(hasPrescriptionItems, dto.paymentMethod, !!dto.paymentInput?.transactionId);
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    addressId: dto.addressId,
                    prescriptionId: dto.prescriptionId ?? null,
                    orderNumber,
                    subtotal,
                    discountTotal,
                    deliveryFee,
                    total,
                    paymentMethod: dto.paymentMethod,
                    paymentStatus,
                    orderStatus,
                    customerNote: dto.customerNote ?? null,
                    items: {
                        createMany: { data: orderItems },
                    },
                },
            });
            await tx.orderStatusLog.create({
                data: {
                    orderId: newOrder.id,
                    newStatus: orderStatus,
                    note: 'Order placed',
                },
            });
            if (dto.paymentMethod !== enums_1.PaymentMethod.COD && dto.paymentInput) {
                await tx.paymentSubmission.create({
                    data: {
                        orderId: newOrder.id,
                        method: dto.paymentMethod,
                        senderNumber: dto.paymentInput.senderNumber ?? null,
                        transactionId: dto.paymentInput.transactionId ?? null,
                        amount: dto.paymentInput.amount ?? total,
                        paymentTime: dto.paymentInput.paymentTime
                            ? new Date(dto.paymentInput.paymentTime)
                            : null,
                        screenshotUrl: dto.paymentInput.screenshotUrl ?? null,
                        status: 'SUBMITTED',
                    },
                });
            }
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQty: { decrement: item.quantity } },
                });
            }
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            return newOrder;
        });
        return {
            id: order.id,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            subtotal: Number(order.subtotal),
            discountTotal: Number(order.discountTotal),
            deliveryFee: Number(order.deliveryFee),
            total: Number(order.total),
            itemCount: orderItems.length,
            prescriptionLinked: !!dto.prescriptionId,
            createdAt: order.createdAt,
        };
    }
    async getCartWithProducts(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { where: { isPrimary: true }, take: 1 },
                            },
                        },
                    },
                },
            },
        });
        if (!cart) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        return cart;
    }
    async validateAddress(userId, addressId) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.userId !== userId) {
            throw new common_1.ForbiddenException('Address does not belong to you');
        }
        return address;
    }
    async validatePrescription(userId, prescriptionId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.userId !== userId) {
            throw new common_1.ForbiddenException('Prescription does not belong to you');
        }
        return prescription;
    }
    async validatePaymentMethod(method, settings) {
        if (method === enums_1.PaymentMethod.COD && settings && !settings.codEnabled) {
            throw new common_1.BadRequestException('Cash on Delivery is currently not available');
        }
    }
    async getSettings() {
        return this.prisma.appSetting.findFirst();
    }
    calculateDeliveryFee(district, subtotal, settings) {
        if (!settings)
            return 60;
        const threshold = settings.freeDeliveryThreshold
            ? Number(settings.freeDeliveryThreshold)
            : null;
        if (threshold && subtotal >= threshold) {
            return 0;
        }
        const isDhaka = district.toLowerCase().includes('dhaka');
        if (isDhaka) {
            return Number(settings.dhakaDeliveryCharge ?? 60);
        }
        return Number(settings.outsideDhakaCharge ?? 120);
    }
    calculateItemTotals(items) {
        let subtotal = 0;
        let discountTotal = 0;
        let hasPrescriptionItems = false;
        const mappedItems = items.map((item) => {
            const product = item.product;
            const price = Number(product.price);
            const discountPrice = product.discountPrice
                ? Number(product.discountPrice)
                : null;
            const effectivePrice = discountPrice ?? price;
            const itemDiscount = discountPrice ? (price - discountPrice) * item.quantity : 0;
            const lineTotal = effectivePrice * item.quantity;
            subtotal += lineTotal;
            discountTotal += itemDiscount;
            if (product.isPrescriptionRequired) {
                hasPrescriptionItems = true;
            }
            return {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                genericName: product.genericName,
                strength: product.strength,
                packSize: product.packSize,
                price,
                discountPrice,
                quantity: item.quantity,
                lineTotal: this.round(lineTotal),
                isPrescriptionRequired: product.isPrescriptionRequired,
                image: product.images?.[0]?.imageUrl ?? null,
            };
        });
        return {
            items: mappedItems,
            subtotal,
            discountTotal,
            hasPrescriptionItems,
        };
    }
    buildOrderItems(items) {
        let subtotal = 0;
        let discountTotal = 0;
        let hasPrescriptionItems = false;
        const orderItems = items.map((item) => {
            const product = item.product;
            const price = Number(product.price);
            const discountPrice = product.discountPrice
                ? Number(product.discountPrice)
                : null;
            const effectivePrice = discountPrice ?? price;
            const itemDiscount = discountPrice ? (price - discountPrice) * item.quantity : 0;
            const lineTotal = effectivePrice * item.quantity;
            subtotal += lineTotal;
            discountTotal += itemDiscount;
            if (product.isPrescriptionRequired) {
                hasPrescriptionItems = true;
            }
            return {
                productId: product.id,
                productNameSnapshot: product.name,
                genericNameSnapshot: product.genericName,
                manufacturerSnapshot: product.manufacturerName,
                strengthSnapshot: product.strength,
                packSizeSnapshot: product.packSize,
                skuSnapshot: product.sku,
                imageSnapshot: product.images?.[0]?.imageUrl ?? null,
                unitPrice: effectivePrice,
                discountAmount: discountPrice ? price - discountPrice : 0,
                quantity: item.quantity,
                lineTotal,
                requiresPrescription: product.isPrescriptionRequired,
            };
        });
        return { subtotal, discountTotal, hasPrescriptionItems, orderItems };
    }
    checkStockAvailability(items) {
        const warnings = [];
        for (const item of items) {
            if (item.product.status !== 'ACTIVE') {
                warnings.push(`${item.product.name} is no longer available`);
            }
            else if (item.quantity > item.product.stockQty) {
                warnings.push(`${item.product.name} only has ${item.product.stockQty} items in stock`);
            }
        }
        return warnings;
    }
    determineInitialStatuses(hasPrescriptionItems, paymentMethod, hasPaymentInput) {
        if (hasPrescriptionItems) {
            return {
                orderStatus: 'PRESCRIPTION_REVIEW_PENDING',
                paymentStatus: paymentMethod === enums_1.PaymentMethod.COD
                    ? 'COD_PENDING'
                    : hasPaymentInput
                        ? 'SUBMITTED'
                        : 'PENDING',
            };
        }
        if (paymentMethod === enums_1.PaymentMethod.COD) {
            return {
                orderStatus: 'PENDING',
                paymentStatus: 'COD_PENDING',
            };
        }
        return {
            orderStatus: hasPaymentInput
                ? 'PAYMENT_VERIFICATION_PENDING'
                : 'PAYMENT_PENDING',
            paymentStatus: hasPaymentInput
                ? 'SUBMITTED'
                : 'PENDING',
        };
    }
    round(n) {
        return Math.round(n * 100) / 100;
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map