import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const payment = await prisma.paymentSubmission.findFirst({
      where: { id, userId: user.id },
      include: { order: { select: { orderNumber: true, total: true } } },
    });

    if (!payment) {
      return errorResponse('Payment not found', 404);
    }

    return successResponse(payment);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Payment detail error:', error);
    return errorResponse('Failed to fetch payment', 500);
  }
}
