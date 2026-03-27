import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderQueryDto } from './dto/order-query.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/constants';

const ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  orderStatus: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  deliveryFee: true,
  total: true,
  placedAt: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      productNameSnapshot: true,
      imageSnapshot: true,
      quantity: true,
      unitPrice: true,
      lineTotal: true,
    },
    take: 3,
  },
  _count: { select: { items: true } },
};

const ORDER_DETAIL_INCLUDE = {
  items: {
    select: {
      id: true,
      productId: true,
      productNameSnapshot: true,
      genericNameSnapshot: true,
      manufacturerSnapshot: true,
      strengthSnapshot: true,
      packSizeSnapshot: true,
      skuSnapshot: true,
      imageSnapshot: true,
      unitPrice: true,
      discountAmount: true,
      quantity: true,
      lineTotal: true,
      requiresPrescription: true,
    },
  },
  address: {
    select: {
      id: true,
      label: true,
      recipientName: true,
      phone: true,
      division: true,
      district: true,
      upazilaThana: true,
      area: true,
      addressLine: true,
      houseFlat: true,
    },
  },
  prescription: {
    select: {
      id: true,
      patientName: true,
      doctorName: true,
      status: true,
      pharmacistNote: true,
      fileUrl: true,
    },
  },
  statusLogs: {
    select: {
      id: true,
      oldStatus: true,
      newStatus: true,
      note: true,
      createdAt: true,
      changedBy: { select: { id: true, fullName: true, role: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  payments: {
    select: {
      id: true,
      method: true,
      senderNumber: true,
      transactionId: true,
      amount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' as const },
  },
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getUserOrders(userId: string, query: OrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) {
      where.orderStatus = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        select: ORDER_LIST_SELECT,
        orderBy: { placedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: items.map(this.formatOrderListItem),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_DETAIL_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return this.formatOrderDetail(order);
  }

  async trackOrder(dto: TrackOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber: dto.orderNumber },
      include: {
        address: { select: { phone: true } },
        user: { select: { phone: true } },
        items: {
          select: {
            productNameSnapshot: true,
            quantity: true,
            lineTotal: true,
          },
        },
        statusLogs: {
          select: {
            oldStatus: true,
            newStatus: true,
            note: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found. Please check your order number.');
    }

    // Validate phone against address phone or user phone
    const addressPhone = order.address?.phone;
    const userPhone = order.user?.phone;
    if (dto.phone !== addressPhone && dto.phone !== userPhone) {
      throw new NotFoundException(
        'Order not found. Please check your order number and phone number.',
      );
    }

    return {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: Number(order.total),
      itemCount: order.items.length,
      items: order.items.map((i) => ({
        name: i.productNameSnapshot,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
      placedAt: order.placedAt,
      timeline: order.statusLogs.map((log) => ({
        from: log.oldStatus,
        to: log.newStatus,
        note: log.note,
        at: log.createdAt,
      })),
    };
  }

  async updateOrderStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    actorId: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const statusTimestamps = this.getStatusTimestamp(dto.orderStatus);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: dto.orderStatus,
          ...statusTimestamps,
        },
      });

      await tx.orderStatusLog.create({
        data: {
          orderId,
          oldStatus: order.orderStatus,
          newStatus: dto.orderStatus,
          note: dto.note ?? null,
          changedById: actorId,
        },
      });

      return this.formatOrderListItem({
        ...updated,
        items: [],
        _count: { items: 0 },
      });
    });
  }

  private getStatusTimestamp(status: string): Record<string, Date> {
    const now = new Date();
    switch (status) {
      case 'SHIPPED':
        return { shippedAt: now };
      case 'DELIVERED':
        return { deliveredAt: now };
      case 'CANCELLED':
        return { cancelledAt: now };
      default:
        return {};
    }
  }

  private formatOrderListItem(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
      itemCount: order._count?.items ?? order.items?.length ?? 0,
      items: order.items?.map((i: any) => ({
        name: i.productNameSnapshot,
        image: i.imageSnapshot,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      })),
      placedAt: order.placedAt,
    };
  }

  private formatOrderDetail(order: any) {
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
      currency: order.currency,
      customerNote: order.customerNote,
      adminNote: order.adminNote,
      placedAt: order.placedAt,
      approvedAt: order.approvedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      items: order.items.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        name: i.productNameSnapshot,
        genericName: i.genericNameSnapshot,
        manufacturer: i.manufacturerSnapshot,
        strength: i.strengthSnapshot,
        packSize: i.packSizeSnapshot,
        sku: i.skuSnapshot,
        image: i.imageSnapshot,
        unitPrice: Number(i.unitPrice),
        discountAmount: Number(i.discountAmount),
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
        requiresPrescription: i.requiresPrescription,
      })),
      address: order.address,
      prescription: order.prescription,
      payments: order.payments?.map((p: any) => ({
        id: p.id,
        method: p.method,
        senderNumber: p.senderNumber,
        transactionId: p.transactionId,
        amount: Number(p.amount),
        status: p.status,
        createdAt: p.createdAt,
      })),
      timeline: order.statusLogs.map((log: any) => ({
        id: log.id,
        from: log.oldStatus,
        to: log.newStatus,
        note: log.note,
        at: log.createdAt,
        changedBy: log.changedBy
          ? { name: log.changedBy.fullName, role: log.changedBy.role }
          : null,
      })),
    };
  }
}
