import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ReviewPrescriptionDto, ReviewStatus } from './dto/review-prescription.dto';
import { PrescriptionQueryDto } from './dto/prescription-query.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/constants';

const PRESCRIPTION_INCLUDE = {
  orders: {
    select: { id: true, orderNumber: true, orderStatus: true },
    take: 5,
  },
  reviewedBy: {
    select: { id: true, fullName: true, role: true },
  },
  items: {
    include: {
      product: {
        select: { id: true, name: true, slug: true, genericName: true },
      },
    },
  },
};

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async createPrescription(userId: string, dto: CreatePrescriptionDto) {
    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.userId !== userId) {
        throw new ForbiddenException('Order does not belong to you');
      }
    }

    const prescription = await this.prisma.prescription.create({
      data: {
        userId,
        patientName: dto.patientName,
        doctorName: dto.doctorName,
        fileUrl: dto.fileUrl ?? null,
        fileName: dto.fileName ?? null,
        fileType: dto.fileType ?? null,
        issuedDate: dto.issuedDate ? new Date(dto.issuedDate) : null,
        notes: dto.notes ?? null,
        orderId: dto.orderId ?? null,
        status: 'PENDING',
      },
      include: PRESCRIPTION_INCLUDE,
    });

    return this.formatPrescription(prescription);
  }

  async getUserPrescriptions(userId: string, query: PrescriptionQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        include: PRESCRIPTION_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      items: items.map(this.formatPrescription),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserPrescriptionById(userId: string, id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: PRESCRIPTION_INCLUDE,
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    if (prescription.userId !== userId) {
      throw new ForbiddenException('You do not have access to this prescription');
    }

    return this.formatPrescription(prescription);
  }

  async reviewPrescription(
    id: string,
    dto: ReviewPrescriptionDto,
    reviewerId: string,
  ) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: { orders: { select: { id: true, orderStatus: true } } },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.prescription.update({
        where: { id },
        data: {
          status: dto.status,
          pharmacistNote: dto.pharmacistNote ?? null,
          reviewedById: reviewerId,
          reviewedAt: new Date(),
        },
        include: PRESCRIPTION_INCLUDE,
      });

      // Update linked orders
      for (const order of prescription.orders) {
        if (order.orderStatus !== 'PRESCRIPTION_REVIEW_PENDING') continue;

        let newOrderStatus: string;

        switch (dto.status) {
          case ReviewStatus.APPROVED:
          case ReviewStatus.PARTIALLY_APPROVED:
            newOrderStatus = 'PRESCRIPTION_APPROVED';
            break;
          case ReviewStatus.REJECTED:
            newOrderStatus = 'PRESCRIPTION_REJECTED';
            break;
          case ReviewStatus.NEEDS_CLARIFICATION:
            // Keep the order in review-pending state
            continue;
          default:
            continue;
        }

        await tx.order.update({
          where: { id: order.id },
          data: { orderStatus: newOrderStatus as any },
        });

        await tx.orderStatusLog.create({
          data: {
            orderId: order.id,
            oldStatus: order.orderStatus,
            newStatus: newOrderStatus as any,
            note: dto.pharmacistNote
              ? `Prescription ${dto.status.toLowerCase()}: ${dto.pharmacistNote}`
              : `Prescription ${dto.status.toLowerCase()}`,
            changedById: reviewerId,
          },
        });
      }

      return this.formatPrescription(updated);
    });
  }

  private formatPrescription(prescription: any) {
    return {
      id: prescription.id,
      patientName: prescription.patientName,
      doctorName: prescription.doctorName,
      fileUrl: prescription.fileUrl,
      fileName: prescription.fileName,
      fileType: prescription.fileType,
      issuedDate: prescription.issuedDate,
      notes: prescription.notes,
      status: prescription.status,
      pharmacistNote: prescription.pharmacistNote,
      reviewedBy: prescription.reviewedBy
        ? {
            name: prescription.reviewedBy.fullName,
            role: prescription.reviewedBy.role,
          }
        : null,
      reviewedAt: prescription.reviewedAt,
      orders: prescription.orders ?? [],
      items: prescription.items?.map((item: any) => ({
        id: item.id,
        requestedQty: item.requestedQty,
        approvedQty: item.approvedQty,
        status: item.status,
        note: item.note,
        product: item.product,
      })) ?? [],
      createdAt: prescription.createdAt,
      updatedAt: prescription.updatedAt,
    };
  }
}
