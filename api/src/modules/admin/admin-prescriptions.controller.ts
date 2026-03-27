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
import { AdminPrescriptionQueryDto } from './dto/admin-prescription-query.dto';
import { ReviewPrescriptionDto } from '../prescriptions/dto/review-prescription.dto';
import { PrescriptionsService } from '../prescriptions/prescriptions.service';
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
@Roles(UserRole.ADMIN, UserRole.PHARMACIST)
@Controller('admin/prescriptions')
export class AdminPrescriptionsController {
  constructor(
    private prescriptionsService: PrescriptionsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all prescriptions (admin)' })
  async findAll(@Query() query: AdminPrescriptionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? ADMIN_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: Prisma.PrescriptionWhereInput = {};
    const andConditions: Prisma.PrescriptionWhereInput[] = [];

    if (query.status) andConditions.push({ status: query.status });
    if (query.q) {
      andConditions.push({
        OR: [
          { patientName: { contains: query.q, mode: 'insensitive' } },
          { user: { fullName: { contains: query.q, mode: 'insensitive' } } },
          { orders: { some: { orderNumber: { contains: query.q, mode: 'insensitive' } } } },
        ],
      });
    }
    if (query.fromDate) andConditions.push({ createdAt: { gte: new Date(query.fromDate) } });
    if (query.toDate) andConditions.push({ createdAt: { lte: new Date(query.toDate) } });
    if (andConditions.length > 0) where.AND = andConditions;

    const [items, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        select: {
          id: true,
          patientName: true,
          doctorName: true,
          issuedDate: true,
          status: true,
          fileUrl: true,
          createdAt: true,
          reviewedAt: true,
          user: { select: { fullName: true, email: true, phone: true } },
          orders: { select: { orderNumber: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        id: p.id,
        patientName: p.patientName,
        doctorName: p.doctorName,
        issuedDate: p.issuedDate,
        status: p.status,
        fileUrl: p.fileUrl,
        customerName: p.user.fullName,
        customerPhone: p.user.phone,
        orderNumber: p.orders[0]?.orderNumber ?? null,
        createdAt: p.createdAt,
        reviewedAt: p.reviewedAt,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription detail (admin)' })
  async findOne(@Param('id') id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        reviewedBy: { select: { id: true, fullName: true, role: true } },
        orders: { select: { id: true, orderNumber: true, orderStatus: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, genericName: true } },
          },
        },
      },
    });

    if (!prescription) throw new Error('Prescription not found');
    return prescription;
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Review prescription (admin/pharmacist)' })
  @ApiResponse({ status: 200, description: 'Prescription reviewed' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewPrescriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.prescriptionsService.reviewPrescription(id, dto, user.sub);
  }
}
