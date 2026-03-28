import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function DELETE() {
  try {
    const user = await requireAuth();

    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return successResponse({ message: 'Cart cleared' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Cart clear error:', error);
    return errorResponse('Failed to clear cart', 500);
  }
}
