import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await requireAuth();

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return successResponse(items);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Wishlist get error:', error);
    return errorResponse('Failed to fetch wishlist', 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { productId } = await request.json();

    if (!productId) {
      return errorResponse('productId is required');
    }

    // Toggle wishlist - if exists, remove; if not, add
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return successResponse({ added: false, message: 'Removed from wishlist' });
    }

    await prisma.wishlistItem.create({
      data: { userId: user.id, productId },
    });

    return successResponse({ added: true, message: 'Added to wishlist' }, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Wishlist toggle error:', error);
    return errorResponse('Failed to update wishlist', 500);
  }
}
