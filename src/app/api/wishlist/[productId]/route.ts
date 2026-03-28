import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await requireAuth();
    const { productId } = await params;

    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });

    return successResponse({ message: 'Removed from wishlist' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Wishlist remove error:', error);
    return errorResponse('Failed to remove from wishlist', 500);
  }
}
