import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import type { PrescriptionStatus } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        orders: { select: { id: true, orderNumber: true, orderStatus: true } },
      },
    });

    if (!prescription) return errorResponse('Prescription not found', 404);
    return successResponse(prescription);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin prescription detail error:', error);
    return errorResponse('Failed to fetch prescription', 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { status, pharmacistNote } = await request.json();

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        status: status as PrescriptionStatus,
        pharmacistNote: pharmacistNote || null,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      },
    });

    // If approved, update related pending orders
    if (status === 'approved') {
      await prisma.order.updateMany({
        where: { prescriptionId: id, orderStatus: 'prescription_review_pending' },
        data: { orderStatus: 'approved' },
      });
    }

    return successResponse(prescription);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin prescription update error:', error);
    return errorResponse('Failed to update prescription', 500);
  }
}
