import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAdmin();

    let settings = await prisma.storeSetting.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.storeSetting.create({ data: {} });
    }

    return successResponse(settings);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Settings get error:', error);
    return errorResponse('Failed to fetch settings', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();

    let settings = await prisma.storeSetting.findFirst();

    if (settings) {
      settings = await prisma.storeSetting.update({
        where: { id: settings.id },
        data,
      });
    } else {
      settings = await prisma.storeSetting.create({ data });
    }

    return successResponse(settings);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Settings update error:', error);
    return errorResponse('Failed to update settings', 500);
  }
}
