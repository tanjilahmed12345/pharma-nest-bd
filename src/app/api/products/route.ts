import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-utils';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.ProductWhereInput = { isActive: true };

    const category = searchParams.get('category');
    if (category) {
      where.category = { slug: category };
    }

    const brand = searchParams.get('brand');
    if (brand) where.brand = brand;

    const manufacturer = searchParams.get('manufacturer');
    if (manufacturer) where.manufacturer = manufacturer;

    const dosageForm = searchParams.get('dosageForm');
    if (dosageForm) where.dosageForm = dosageForm;

    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    const isPrescriptionRequired = searchParams.get('isPrescriptionRequired');
    if (isPrescriptionRequired !== null) {
      where.isPrescriptionRequired = isPrescriptionRequired === 'true';
    }

    const inStock = searchParams.get('inStock');
    if (inStock === 'true') {
      where.stockQty = { gt: 0 };
    }

    const isFeatured = searchParams.get('isFeatured');
    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const search = searchParams.get('search');
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Sorting
    const sort = searchParams.get('sort');
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(products, total, page, pageSize);
  } catch (error) {
    console.error('Products list error:', error);
    return errorResponse('Failed to fetch products', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.json();

    const product = await prisma.product.create({
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return successResponse(product, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return errorResponse('Unauthorized', 401);
    if (error instanceof Error && error.message === 'Forbidden') return errorResponse('Forbidden', 403);
    console.error('Product create error:', error);
    return errorResponse('Failed to create product', 500);
  }
}
