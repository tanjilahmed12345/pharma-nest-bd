import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 12,
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return successResponse(products);
  } catch (error) {
    console.error('Featured products error:', error);
    return errorResponse('Failed to fetch featured products', 500);
  }
}
