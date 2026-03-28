import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import type { OrderStatus } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
        statusTimeline: { orderBy: { timestamp: 'desc' } },
        shippingAddress: true,
        payments: true,
        prescription: true,
      },
    });

    if (!order) return errorResponse('Order not found', 404);
    return successResponse(order);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin order detail error:', error);
    return errorResponse('Failed to fetch order', 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { orderStatus, paymentStatus, note } = await request.json();

    const updateData: Record<string, unknown> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, statusTimeline: true },
    });

    // Add status log if order status changed
    if (orderStatus) {
      await prisma.orderStatusLog.create({
        data: {
          orderId: id,
          status: orderStatus as OrderStatus,
          note: note || null,
        },
      });
    }

    return successResponse(order);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Admin order update error:', error);
    return errorResponse('Failed to update order', 500);
  }
}
