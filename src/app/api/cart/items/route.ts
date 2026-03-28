import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return errorResponse('productId is required');
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return errorResponse('Product not found', 404);
    }

    if (product.stockQty < quantity) {
      return errorResponse('Insufficient stock');
    }

    const item = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: { quantity },
      create: { userId: user.id, productId, quantity },
      include: { product: true },
    });

    return successResponse(item, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Cart add error:', error);
    return errorResponse('Failed to add to cart', 500);
  }
}
