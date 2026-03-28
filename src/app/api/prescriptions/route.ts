import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where: { userId: user.id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.prescription.count({ where: { userId: user.id } }),
    ]);

    return paginatedResponse(prescriptions, total, page, pageSize);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Prescriptions list error:', error);
    return errorResponse('Failed to fetch prescriptions', 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const { imageUrl, fileName, patientName, doctorName, issueDate, notes } = data;

    if (!imageUrl || !patientName || !doctorName) {
      return errorResponse('Missing required prescription fields');
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: user.id,
        imageUrl,
        fileName: fileName || 'prescription.jpg',
        patientName,
        doctorName,
        issueDate: issueDate || new Date().toISOString(),
        notes: notes || null,
      },
    });

    return successResponse(prescription, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    console.error('Prescription create error:', error);
    return errorResponse('Failed to upload prescription', 500);
  }
}
