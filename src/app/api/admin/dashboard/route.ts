import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      ordersThisMonth,
      totalRevenue,
      salesThisMonth,
      pendingPrescriptions,
      pendingPayments,
      totalCustomers,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: 'pending' } }),
      prisma.order.count({ where: { orderStatus: 'delivered' } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { orderStatus: 'delivered' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { orderStatus: 'delivered', createdAt: { gte: startOfMonth } } }),
      prisma.prescription.count({ where: { status: 'pending' } }),
      prisma.paymentSubmission.count({ where: { status: 'submitted' } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.product.findMany({ where: { stockQty: { lte: 10 }, isActive: true }, take: 10, orderBy: { stockQty: 'asc' } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
    ]);

    return successResponse({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      deliveredOrders,
      pendingPrescriptions,
      pendingPayments,
      lowStockProducts,
      recentOrders,
      salesThisMonth: salesThisMonth._sum.total || 0,
      ordersThisMonth,
      totalCustomers,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Dashboard error:', error);
    return errorResponse('Failed to fetch dashboard', 500);
  }
}
