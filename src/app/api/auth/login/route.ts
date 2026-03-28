import { prisma } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated', 403);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return errorResponse('Invalid email or password', 401);
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    const { password: _, ...publicUser } = user;
    return successResponse({ user: publicUser, token });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}

