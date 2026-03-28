import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return errorResponse('Email is required');
    }

    // Check user exists (don't reveal if they don't for security)
    await prisma.user.findUnique({ where: { email } });

    // TODO: Send password reset email
    // For now, always return success to prevent email enumeration
    return successResponse({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Request failed', 500);
  }
}
