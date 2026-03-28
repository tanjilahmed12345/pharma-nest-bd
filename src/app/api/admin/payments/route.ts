import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-utils';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.PaymentSubmissionWhereInput = {};

    const status = searchParams.get('status');
    if (status) where.status = status as Prisma.EnumPaymentStatusFilter;

    const [payments, total] = await Promise.all([
      prisma.paymentSubmission.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          order: { select: { id: true, orderNumber: true, total: true } },
        },
      }),
      prisma.paymentSubmission.count({ where }),
    ]);

    return paginatedResponse(payments, total, page, pageSize);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin payments error:', error);
    return errorResponse('Failed to fetch payments', 500);
  }
}
