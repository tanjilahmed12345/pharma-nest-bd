import { successResponse } from '@/lib/api-utils';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return successResponse({ message: 'Logged out' });
}
