import { prisma } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return errorResponse('All fields are required');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
      select: {
        id: true, email: true, name: true, phone: true,
        role: true, avatar: true, isActive: true,
        createdAt: true, updatedAt: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return successResponse({
      user,
      token,
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Registration failed', 500);
  }
}
