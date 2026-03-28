import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const data = await request.json();

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return errorResponse('Address not found', 404);

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data,
    });

    return successResponse(address);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Address update error:', error);
    return errorResponse('Failed to update address', 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) return errorResponse('Address not found', 404);

    await prisma.address.delete({ where: { id } });
    return successResponse({ message: 'Address deleted' });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Address delete error:', error);
    return errorResponse('Failed to delete address', 500);
  }
}
