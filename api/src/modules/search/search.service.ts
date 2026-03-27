import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/constants';

const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  tags: { select: { tag: true } },
};

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(query: SearchQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;
    const q = query.q.trim();

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { genericName: { contains: q, mode: 'insensitive' } },
        { manufacturerName: { contains: q, mode: 'insensitive' } },
        { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        ...p,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        tags: p.tags?.map((t) => t.tag) ?? [],
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
