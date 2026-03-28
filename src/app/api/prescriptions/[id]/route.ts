import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const prescription = await prisma.prescription.findFirst({
      where: { id, userId: user.id },
      include: {
        orders: { select: { id: true, orderNumber: true, orderStatus: true } },
      },
    });

    if (!prescription) {
      return errorResponse('Prescription not found', 404);
    }

    return successResponse(prescription);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Prescription detail error:', error);
    return errorResponse('Failed to fetch prescription', 500);
  }
}
