import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const { orderId, method, senderNumber, transactionId, amount, screenshotUrl } = data;

    if (!orderId || !method || !amount) {
      return errorResponse('Missing required payment fields');
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    });
    if (!order) return errorResponse('Order not found', 404);

    const payment = await prisma.paymentSubmission.create({
      data: {
        orderId,
        userId: user.id,
        method,
        senderNumber: senderNumber || null,
        transactionId: transactionId || null,
        amount,
        status: 'submitted',
        screenshotUrl: screenshotUrl || null,
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'submitted' },
    });

    return successResponse(payment, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Payment submit error:', error);
    return errorResponse('Failed to submit payment', 500);
  }
}
