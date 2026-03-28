import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const user = await requireAuth();

    const items = await prisma.cartItem.findMany({
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
    console.error('Cart get error:', error);
    return errorResponse('Failed to fetch cart', 500);
  }
}
