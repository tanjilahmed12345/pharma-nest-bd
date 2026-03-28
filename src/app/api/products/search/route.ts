import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    if (!query.trim()) {
      return paginatedResponse([], 0, page, pageSize);
    }

    const where = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { genericName: { contains: query, mode: 'insensitive' as const } },
        { brand: { contains: query, mode: 'insensitive' as const } },
        { manufacturer: { contains: query, mode: 'insensitive' as const } },
        { tags: { has: query.toLowerCase() } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(products, total, page, pageSize);
  } catch (error) {
    console.error('Product search error:', error);
    return errorResponse('Search failed', 500);
  }
}
