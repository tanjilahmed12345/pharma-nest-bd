import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          statusTimeline: { orderBy: { timestamp: 'desc' } },
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ]);

    return paginatedResponse(orders, total, page, pageSize);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Orders list error:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const {
      items, shippingAddressId, paymentMethod, prescriptionId,
      couponCode, note, subtotal, deliveryCharge, discount, total,
    } = data;

    if (!items?.length || !shippingAddressId || !paymentMethod) {
      return errorResponse('Missing required order fields');
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `PN-${String(orderCount + 1).padStart(6, '0')}`;

    // Determine initial status
    const hasPrescriptionItems = items.some((i: { isPrescriptionRequired: boolean }) => i.isPrescriptionRequired);
    const orderStatus = hasPrescriptionItems ? 'prescription_review_pending' as const : 'pending' as const;
    const paymentStatus = paymentMethod === 'cod' ? 'cod_pending' as const : 'pending' as const;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        shippingAddressId,
        paymentMethod,
        paymentStatus,
        orderStatus,
        prescriptionId: prescriptionId || null,
        subtotal,
        deliveryCharge,
        discount: discount || 0,
        total,
        couponCode: couponCode || null,
        note: note || null,
        items: {
          create: items.map((item: {
            productId: string;
            productName: string;
            genericName?: string;
            manufacturer?: string;
            strength?: string;
            packSize?: string;
            price: number;
            discountPrice?: number;
            quantity: number;
            isPrescriptionRequired?: boolean;
            image?: string;
          }) => ({
            productId: item.productId,
            productName: item.productName,
            genericName: item.genericName || '',
            manufacturer: item.manufacturer || '',
            strength: item.strength || '',
            packSize: item.packSize || '',
            price: item.price,
            discountPrice: item.discountPrice,
            quantity: item.quantity,
            isPrescriptionRequired: item.isPrescriptionRequired || false,
            image: item.image || '',
          })),
        },
        statusTimeline: {
          create: {
            status: orderStatus,
            note: 'Order placed',
          },
        },
      },
      include: {
        items: true,
        statusTimeline: true,
        shippingAddress: true,
      },
    });

    // Clear user's cart after order
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return successResponse(order, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Order create error:', error);
    return errorResponse('Failed to create order', 500);
  }
}
