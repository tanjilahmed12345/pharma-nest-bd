import { orderRepository, paymentRepository } from '@/repositories';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CheckoutPayload,
  OrderPreview,
} from '@/types';
import { generateOrderNumber, nowISO } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';
import { cartService } from '@/services/cart';
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

export const checkoutService = {
  /**
   * Validate the cart and return a preview before placing the order.
   */
  async getOrderPreview(): Promise<OrderPreview> {
    const preview = await cartService.computeOrderPreview();
    if (preview.items.length === 0) {
      throw AppError.badRequest('Cart is empty');
    }
    return preview;
  },

  /**
   * Place the order from the checkout flow.
   */
  async placeOrder(payload: CheckoutPayload): Promise<Order> {
    // Validations
    if (!payload.items || payload.items.length === 0) {
      throw AppError.badRequest('Cart is empty');
    }

    if (!payload.shippingAddress) {
      throw AppError.validation('Shipping address is required');
    }

    const hasRx = payload.items.some((item) => item.isPrescriptionRequired);
    if (hasRx && !payload.prescriptionId) {
      throw AppError.validation('Prescription is required for Rx medicines');
    }

    if (
      payload.paymentMethod !== PaymentMethod.COD &&
      (!payload.senderNumber || !payload.transactionId)
    ) {
      throw AppError.validation('Sender number and transaction ID are required for wallet payment');
    }

    // Calculate totals
    const subtotal = payload.items.reduce(
      (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
      0
    );

    const discount = payload.items.reduce(
      (sum, item) =>
        item.discountPrice
          ? sum + (item.price - item.discountPrice) * item.quantity
          : sum,
      0
    );

    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const initialStatus = hasRx
      ? OrderStatus.PRESCRIPTION_REVIEW_PENDING
      : OrderStatus.PENDING;

    const paymentStatus =
      payload.paymentMethod === PaymentMethod.COD
        ? PaymentStatus.COD_PENDING
        : PaymentStatus.SUBMITTED;

    const order = await orderRepository.create({
      orderNumber: generateOrderNumber(),
      userId: payload.userId,
      items: payload.items,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      paymentStatus,
      orderStatus: initialStatus,
      statusTimeline: [{ status: initialStatus, timestamp: nowISO() }],
      prescriptionId: payload.prescriptionId,
      subtotal,
      deliveryCharge,
      discount,
      total,
      couponCode: payload.couponCode,
      note: payload.note,
    });

    // Create payment submission for wallet methods
    if (payload.paymentMethod !== PaymentMethod.COD) {
      await paymentRepository.create({
        orderId: order.id,
        userId: payload.userId,
        method: payload.paymentMethod,
        senderNumber: payload.senderNumber,
        transactionId: payload.transactionId,
        amount: total,
        status: PaymentStatus.SUBMITTED,
      });
    }

    // Clear the cart after successful order placement
    cartService.clearCart();

    return order;
  },

  /**
   * Mock coupon validation.
   */
  validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string } {
    const coupons: Record<string, { discount: number; minOrder: number }> = {
      PHARMA10: { discount: 10, minOrder: 200 },
      WELCOME50: { discount: 50, minOrder: 500 },
      HEALTH20: { discount: 20, minOrder: 300 },
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid coupon code' };
    }

    if (subtotal < coupon.minOrder) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order amount is ৳${coupon.minOrder}`,
      };
    }

    return {
      valid: true,
      discountAmount: coupon.discount,
      message: `Coupon applied! ৳${coupon.discount} discount`,
    };
  },
};
