import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams.get('orderNumber');

    if (!orderNumber) {
      return errorResponse('Order number is required');
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        orderStatus: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
        createdAt: true,
        items: {
          select: { productName: true, quantity: true, price: true, image: true },
        },
        statusTimeline: { orderBy: { timestamp: 'desc' } },
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order);
  } catch (error) {
    console.error('Order track error:', error);
    return errorResponse('Failed to track order', 500);
  }
}
