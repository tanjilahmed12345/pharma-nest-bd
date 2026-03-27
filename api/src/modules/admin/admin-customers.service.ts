import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/constants';

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(query: CustomerQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = { role: 'CUSTOMER' };

    if (query.q) {
      where.OR = [
        { fullName: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } },
        { phone: { contains: query.q } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
          orders: {
            select: { total: true, placedAt: true },
            orderBy: { placedAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const items = customers.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      role: c.role,
      status: c.status,
      totalOrders: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
      lastOrderAt: c.orders[0]?.placedAt ?? null,
      createdAt: c.createdAt,
      lastLoginAt: c.lastLoginAt,
    }));

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
