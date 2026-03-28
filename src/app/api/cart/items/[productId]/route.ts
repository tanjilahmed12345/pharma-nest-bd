import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await requireAuth();
    const { productId } = await params;
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return errorResponse('Quantity must be at least 1');
    }

    const item = await prisma.cartItem.update({
      where: { userId_productId: { userId: user.id, productId } },
      data: { quantity },
      include: { product: true },
    });

    return successResponse(item);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Cart update error:', error);
    return errorResponse('Failed to update cart item', 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await requireAuth();
    const { productId } = await params;

    await prisma.cartItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });

    return successResponse({ message: 'Item removed from cart' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Cart remove error:', error);
    return errorResponse('Failed to remove cart item', 500);
  }
}
