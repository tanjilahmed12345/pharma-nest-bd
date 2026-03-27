import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminOrderQueryDto } from './dto/admin-order-query.dto';
import { UpdateAdminNoteDto } from './dto/update-admin-note.dto';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ADMIN_PAGE_SIZE } from '../../common/constants';
import { Prisma } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(
    private ordersService: OrdersService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all orders (admin)' })
  async findAll(@Query() query: AdminOrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? ADMIN_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    const andConditions: Prisma.OrderWhereInput[] = [];

    if (query.q) {
      andConditions.push({
        OR: [
          { orderNumber: { contains: query.q, mode: 'insensitive' } },
          { user: { fullName: { contains: query.q, mode: 'insensitive' } } },
          { user: { phone: { contains: query.q } } },
        ],
      });
    }
    if (query.orderStatus) andConditions.push({ orderStatus: query.orderStatus });
    if (query.paymentStatus) andConditions.push({ paymentStatus: query.paymentStatus });
    if (query.paymentMethod) andConditions.push({ paymentMethod: query.paymentMethod });
    if (query.fromDate) andConditions.push({ placedAt: { gte: new Date(query.fromDate) } });
    if (query.toDate) andConditions.push({ placedAt: { lte: new Date(query.toDate) } });
    if (andConditions.length > 0) where.AND = andConditions;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          orderStatus: true,
          paymentStatus: true,
          paymentMethod: true,
          total: true,
          placedAt: true,
          user: { select: { fullName: true, phone: true } },
          _count: { select: { items: true } },
        },
        orderBy: { placedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        total: Number(o.total),
        itemCount: o._count.items,
        customerName: o.user.fullName,
        customerPhone: o.user.phone,
        placedAt: o.placedAt,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full order detail (admin)' })
  async findOne(@Param('id') id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        items: true,
        address: true,
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
        payments: { orderBy: { createdAt: 'desc' } },
        statusLogs: {
          include: {
            changedBy: { select: { id: true, fullName: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) throw new Error('Order not found');

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
      customer: order.user,
      address: order.address,
      prescription: order.prescription,
      items: order.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice),
        discountAmount: Number(i.discountAmount),
        lineTotal: Number(i.lineTotal),
      })),
      payments: order.payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
      timeline: order.statusLogs.map((log) => ({
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

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.updateOrderStatus(id, dto, user.sub);
  }

  @Patch(':id/note')
  @ApiOperation({ summary: 'Update admin note on order' })
  async updateNote(
    @Param('id') id: string,
    @Body() dto: UpdateAdminNoteDto,
  ) {
    return this.prisma.order.update({
      where: { id },
      data: { adminNote: dto.adminNote },
      select: { id: true, orderNumber: true, adminNote: true },
    });
  }
}
