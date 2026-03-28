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

    const where: Prisma.PrescriptionWhereInput = {};

    const status = searchParams.get('status');
    if (status) where.status = status as Prisma.EnumPrescriptionStatusFilter;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      }),
      prisma.prescription.count({ where }),
    ]);

    return paginatedResponse(prescriptions, total, page, pageSize);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin prescriptions error:', error);
    return errorResponse('Failed to fetch prescriptions', 500);
  }
}
