import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error('Categories list error:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();

    const category = await prisma.category.create({ data });
    return successResponse(category, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Category create error:', error);
    return errorResponse('Failed to create category', 500);
  }
}
