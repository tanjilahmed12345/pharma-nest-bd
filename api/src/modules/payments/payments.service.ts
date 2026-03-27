import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { VerifyPaymentDto, VerifyStatus } from './dto/verify-payment.dto';
import { PaymentMethod } from '../../common/enums';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async submitPayment(userId: string, dto: SubmitPaymentDto) {
    if (dto.method === PaymentMethod.COD) {
      throw new BadRequestException(
        'COD orders do not require payment submission',
      );
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('Order does not belong to you');
    }

    const submission = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.paymentSubmission.create({
        data: {
          orderId: dto.orderId,
          method: dto.method,
          senderNumber: dto.senderNumber,
          transactionId: dto.transactionId,
          amount: dto.amount ?? Number(order.total),
          paymentTime: dto.paymentTime ? new Date(dto.paymentTime) : null,
          screenshotUrl: dto.screenshotUrl ?? null,
          status: 'SUBMITTED',
        },
      });

      // Update order payment status
      const shouldUpdateOrderStatus =
        order.orderStatus === 'PAYMENT_PENDING' ||
        order.orderStatus === 'PENDING';

      await tx.order.update({
        where: { id: dto.orderId },
        data: {
          paymentStatus: 'SUBMITTED',
          ...(shouldUpdateOrderStatus && {
            orderStatus: 'PAYMENT_VERIFICATION_PENDING',
          }),
        },
      });

      if (shouldUpdateOrderStatus) {
        await tx.orderStatusLog.create({
          data: {
            orderId: dto.orderId,
            oldStatus: order.orderStatus,
            newStatus: 'PAYMENT_VERIFICATION_PENDING',
            note: `Payment submitted via ${dto.method}`,
          },
        });
      }

      return payment;
    });

    return this.formatPayment(submission);
  }

  async getOrderPayments(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('Order does not belong to you');
    }

    const payments = await this.prisma.paymentSubmission.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(this.formatPayment);
  }

  async verifyPayment(
    id: string,
    dto: VerifyPaymentDto,
    verifierId: string,
  ) {
    const payment = await this.prisma.paymentSubmission.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderStatus: true,
            paymentStatus: true,
            prescriptionId: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment submission not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.paymentSubmission.update({
        where: { id },
        data: {
          status: dto.status === VerifyStatus.VERIFIED ? 'VERIFIED' : 'REJECTED',
          verificationNote: dto.verificationNote ?? null,
          verifiedById: verifierId,
          verifiedAt: new Date(),
        },
      });

      const order = payment.order;

      if (dto.status === VerifyStatus.VERIFIED) {
        // Determine new order status based on current state
        let newOrderStatus = order.orderStatus;

        if (
          order.orderStatus === 'PAYMENT_VERIFICATION_PENDING' ||
          order.orderStatus === 'PRESCRIPTION_APPROVED'
        ) {
          newOrderStatus = 'PROCESSING';
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'VERIFIED',
            orderStatus: newOrderStatus as any,
          },
        });

        if (newOrderStatus !== order.orderStatus) {
          await tx.orderStatusLog.create({
            data: {
              orderId: order.id,
              oldStatus: order.orderStatus,
              newStatus: newOrderStatus as any,
              note: 'Payment verified',
              changedById: verifierId,
            },
          });
        }
      } else {
        // Rejected
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'REJECTED' },
        });
      }

      return this.formatPayment(updated);
    });
  }

  private formatPayment(payment: any) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method,
      senderNumber: payment.senderNumber,
      transactionId: payment.transactionId,
      amount: Number(payment.amount),
      paymentTime: payment.paymentTime,
      screenshotUrl: payment.screenshotUrl,
      status: payment.status,
      verificationNote: payment.verificationNote,
      verifiedAt: payment.verifiedAt,
      createdAt: payment.createdAt,
    };
  }
}
