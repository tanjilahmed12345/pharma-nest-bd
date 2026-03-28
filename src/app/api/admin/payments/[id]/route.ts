import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import type { PaymentStatus } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { status, note } = await request.json();

    const payment = await prisma.paymentSubmission.update({
      where: { id },
      data: {
        status: status as PaymentStatus,
        note: note || null,
        verifiedBy: admin.id,
        verifiedAt: new Date(),
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: status as PaymentStatus },
    });

    return successResponse(payment);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin payment update error:', error);
    return errorResponse('Failed to update payment', 500);
  }
}
