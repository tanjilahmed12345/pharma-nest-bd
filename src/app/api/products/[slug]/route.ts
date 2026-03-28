import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error('Product detail error:', error);
    return errorResponse('Failed to fetch product', 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;
    const data = await request.json();

    const product = await prisma.product.update({
      where: { slug },
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return successResponse(product);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Product update error:', error);
    return errorResponse('Failed to update product', 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin();
    const { slug } = await params;

    await prisma.product.delete({ where: { slug } });
    return successResponse({ message: 'Product deleted' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Product delete error:', error);
    return errorResponse('Failed to delete product', 500);
  }
}
