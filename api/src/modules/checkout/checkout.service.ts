import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PaymentMethod } from '../../common/enums';
import { generateOrderNumber } from '../../common/utils';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async preview(userId: string, dto: CheckoutPreviewDto) {
    const cart = await this.getCartWithProducts(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.validateAddress(userId, dto.addressId);
    const settings = await this.getSettings();
    await this.validatePaymentMethod(dto.paymentMethod, settings);

    const { items, subtotal, discountTotal, hasPrescriptionItems } =
      this.calculateItemTotals(cart.items);

    const deliveryFee = this.calculateDeliveryFee(
      address.district,
      subtotal,
      settings,
    );
    const total = subtotal - discountTotal + deliveryFee;

    const warnings: string[] = [];
    const stockWarnings = this.checkStockAvailability(cart.items);
    warnings.push(...stockWarnings);

    if (hasPrescriptionItems && !dto.prescriptionId) {
      warnings.push(
        'Your cart contains prescription-required items. A valid prescription must be provided to complete the order.',
      );
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

  async placeOrder(userId: string, dto: PlaceOrderDto) {
    const cart = await this.getCartWithProducts(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.validateAddress(userId, dto.addressId);
    const settings = await this.getSettings();
    await this.validatePaymentMethod(dto.paymentMethod, settings);

    const { subtotal, discountTotal, hasPrescriptionItems, orderItems } =
      this.buildOrderItems(cart.items);

    // Validate stock
    const stockIssues = this.checkStockAvailability(cart.items);
    if (stockIssues.length > 0) {
      throw new BadRequestException(stockIssues[0]);
    }

    // Validate prescription requirement
    if (hasPrescriptionItems && !dto.prescriptionId) {
      throw new BadRequestException(
        'A prescription is required for one or more items in your cart',
      );
    }

    if (dto.prescriptionId) {
      await this.validatePrescription(userId, dto.prescriptionId);
    }

    // Validate wallet payment input
    if (dto.paymentMethod !== PaymentMethod.COD && dto.paymentInput) {
      if (!dto.paymentInput.transactionId) {
        throw new BadRequestException(
          'Transaction ID is required for mobile wallet payments',
        );
      }
    }

    const deliveryFee = this.calculateDeliveryFee(
      address.district,
      subtotal,
      settings,
    );
    const total = subtotal - discountTotal + deliveryFee;
    const orderNumber = generateOrderNumber();

    // Determine initial statuses
    const { orderStatus, paymentStatus } = this.determineInitialStatuses(
      hasPrescriptionItems,
      dto.paymentMethod,
      !!dto.paymentInput?.transactionId,
    );

    // Create order in transaction
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

      // Create initial status log
      await tx.orderStatusLog.create({
        data: {
          orderId: newOrder.id,
          newStatus: orderStatus,
          note: 'Order placed',
        },
      });

      // Create payment submission for wallet payments
      if (dto.paymentMethod !== PaymentMethod.COD && dto.paymentInput) {
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

      // Decrease stock for each item
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.quantity } },
        });
      }

      // Clear cart
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

  // ── Helpers ──

  private async getCartWithProducts(userId: string) {
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
      throw new BadRequestException('Cart is empty');
    }

    return cart;
  }

  private async validateAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('Address does not belong to you');
    }

    return address;
  }

  private async validatePrescription(userId: string, prescriptionId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    if (prescription.userId !== userId) {
      throw new ForbiddenException('Prescription does not belong to you');
    }

    return prescription;
  }

  private async validatePaymentMethod(
    method: PaymentMethod,
    settings: any,
  ) {
    if (method === PaymentMethod.COD && settings && !settings.codEnabled) {
      throw new BadRequestException(
        'Cash on Delivery is currently not available',
      );
    }
  }

  private async getSettings() {
    return this.prisma.appSetting.findFirst();
  }

  private calculateDeliveryFee(
    district: string,
    subtotal: number,
    settings: any,
  ): number {
    if (!settings) return 60;

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

  private calculateItemTotals(items: any[]) {
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

  private buildOrderItems(items: any[]) {
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

  private checkStockAvailability(items: any[]): string[] {
    const warnings: string[] = [];
    for (const item of items) {
      if (item.product.status !== 'ACTIVE') {
        warnings.push(`${item.product.name} is no longer available`);
      } else if (item.quantity > item.product.stockQty) {
        warnings.push(
          `${item.product.name} only has ${item.product.stockQty} items in stock`,
        );
      }
    }
    return warnings;
  }

  private determineInitialStatuses(
    hasPrescriptionItems: boolean,
    paymentMethod: PaymentMethod,
    hasPaymentInput: boolean,
  ) {
    // Prescription always takes precedence
    if (hasPrescriptionItems) {
      return {
        orderStatus: 'PRESCRIPTION_REVIEW_PENDING' as const,
        paymentStatus: paymentMethod === PaymentMethod.COD
          ? ('COD_PENDING' as const)
          : hasPaymentInput
            ? ('SUBMITTED' as const)
            : ('PENDING' as const),
      };
    }

    if (paymentMethod === PaymentMethod.COD) {
      return {
        orderStatus: 'PENDING' as const,
        paymentStatus: 'COD_PENDING' as const,
      };
    }

    // Wallet payment
    return {
      orderStatus: hasPaymentInput
        ? ('PAYMENT_VERIFICATION_PENDING' as const)
        : ('PAYMENT_PENDING' as const),
      paymentStatus: hasPaymentInput
        ? ('SUBMITTED' as const)
        : ('PENDING' as const),
    };
  }

  private round(n: number): number {
    return Math.round(n * 100) / 100;
  }
}
