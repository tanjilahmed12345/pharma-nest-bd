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
import { AdminPaymentQueryDto } from './dto/admin-payment-query.dto';
import { VerifyPaymentDto } from '../payments/dto/verify-payment.dto';
import { PaymentsService } from '../payments/payments.service';
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
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all payment submissions (admin)' })
  async findAll(@Query() query: AdminPaymentQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? ADMIN_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentSubmissionWhereInput = {};
    const andConditions: Prisma.PaymentSubmissionWhereInput[] = [];

    if (query.status) andConditions.push({ status: query.status });
    if (query.method) andConditions.push({ method: query.method });
    if (query.q) {
      andConditions.push({
        OR: [
          { order: { orderNumber: { contains: query.q, mode: 'insensitive' } } },
          { senderNumber: { contains: query.q } },
          { transactionId: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }
    if (query.fromDate) andConditions.push({ createdAt: { gte: new Date(query.fromDate) } });
    if (query.toDate) andConditions.push({ createdAt: { lte: new Date(query.toDate) } });
    if (andConditions.length > 0) where.AND = andConditions;

    const [items, total] = await Promise.all([
      this.prisma.paymentSubmission.findMany({
        where,
        select: {
          id: true,
          method: true,
          senderNumber: true,
          transactionId: true,
          amount: true,
          status: true,
          createdAt: true,
          order: {
            select: {
              orderNumber: true,
              user: { select: { fullName: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paymentSubmission.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        id: p.id,
        method: p.method,
        senderNumber: p.senderNumber,
        transactionId: p.transactionId,
        amount: Number(p.amount),
        status: p.status,
        orderNumber: p.order.orderNumber,
        customerName: p.order.user.fullName,
        customerPhone: p.order.user.phone,
        createdAt: p.createdAt,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment detail (admin)' })
  async findOne(@Param('id') id: string) {
    const payment = await this.prisma.paymentSubmission.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            paymentStatus: true,
            total: true,
            user: { select: { id: true, fullName: true, email: true, phone: true } },
          },
        },
        verifiedBy: { select: { id: true, fullName: true, role: true } },
      },
    });

    if (!payment) throw new Error('Payment not found');

    return {
      ...payment,
      amount: Number(payment.amount),
      order: {
        ...payment.order,
        total: Number(payment.order.total),
      },
    };
  }

  @Patch(':id/verify')
  @ApiOperation({ summary: 'Verify or reject payment (admin)' })
  @ApiResponse({ status: 200, description: 'Payment verified/rejected' })
  async verify(
    @Param('id') id: string,
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.verifyPayment(id, dto, user.sub);
  }
}
