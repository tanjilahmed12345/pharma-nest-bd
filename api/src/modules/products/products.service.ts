import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto, ProductSort } from './dto/product-query.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/constants';

const PUBLIC_PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  tags: { select: { tag: true } },
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ── Public listing ──

  async getProducts(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where = this.buildPublicWhere(query);
    const orderBy = this.buildOrderBy(query.sort);

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PUBLIC_PRODUCT_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(this.formatProduct),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        ...PUBLIC_PRODUCT_INCLUDE,
        alternatives: {
          include: {
            alternative: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
          take: 6,
        },
      },
    });

    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundException('Product not found');
    }

    return this.formatProductDetail(product);
  }

  async getFeaturedProducts(limit = 12) {
    const items = await this.prisma.product.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      include: PUBLIC_PRODUCT_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return items.map(this.formatProduct);
  }

  async getOfferProducts(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      discountPrice: { not: null },
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PUBLIC_PRODUCT_INCLUDE,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(this.formatProduct),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOtcProducts(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      isPrescriptionRequired: false,
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PUBLIC_PRODUCT_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(this.formatProduct),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRxProducts(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      isPrescriptionRequired: true,
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PUBLIC_PRODUCT_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map(this.formatProduct),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRelatedProducts(slug: string, limit = 8) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true, categoryId: true, brandId: true, genericName: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const items = await this.prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          ...(product.brandId ? [{ brandId: product.brandId }] : []),
          { genericName: { contains: product.genericName, mode: 'insensitive' as const } },
        ],
      },
      include: PUBLIC_PRODUCT_INCLUDE,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return items.map(this.formatProduct);
  }

  // ── Admin CRUD ──

  async createProduct(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('A product with this slug already exists');
    }

    await this.validateCategoryAndBrand(dto.categoryId, dto.brandId);
    this.validatePricing(dto.price, dto.discountPrice);

    const { images, tags, ...productData } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images?.length
          ? { createMany: { data: images } }
          : undefined,
        tags: tags?.length
          ? { createMany: { data: tags.map((tag) => ({ tag })) } }
          : undefined,
      },
      include: PUBLIC_PRODUCT_INCLUDE,
    });

    return this.formatProduct(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('A product with this slug already exists');
      }
    }

    if (dto.categoryId || dto.brandId) {
      await this.validateCategoryAndBrand(
        dto.categoryId ?? product.categoryId,
        dto.brandId ?? product.brandId,
      );
    }

    const effectivePrice = dto.price ?? Number(product.price);
    const effectiveDiscount = dto.discountPrice ?? (product.discountPrice ? Number(product.discountPrice) : undefined);
    this.validatePricing(effectivePrice, effectiveDiscount);

    const { images, tags, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img) => ({ ...img, productId: id })),
          });
        }
      }

      if (tags !== undefined) {
        await tx.productTag.deleteMany({ where: { productId: id } });
        if (tags.length > 0) {
          await tx.productTag.createMany({
            data: tags.map((tag) => ({ tag, productId: id })),
          });
        }
      }

      const updated = await tx.product.update({
        where: { id },
        data: productData,
        include: PUBLIC_PRODUCT_INCLUDE,
      });

      return this.formatProduct(updated);
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async toggleActive(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = await this.prisma.product.update({
      where: { id },
      data: { status: newStatus },
      include: PUBLIC_PRODUCT_INCLUDE,
    });

    return this.formatProduct(updated);
  }

  async toggleFeatured(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
      include: PUBLIC_PRODUCT_INCLUDE,
    });

    return this.formatProduct(updated);
  }

  // ── Helpers ──

  private buildPublicWhere(query: ProductQueryDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = { status: 'ACTIVE' };
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (query.q) {
      andConditions.push({
        OR: [
          { name: { contains: query.q, mode: 'insensitive' } },
          { genericName: { contains: query.q, mode: 'insensitive' } },
          { manufacturerName: { contains: query.q, mode: 'insensitive' } },
          { tags: { some: { tag: { contains: query.q, mode: 'insensitive' } } } },
        ],
      });
    }

    if (query.categorySlug) {
      andConditions.push({
        category: { slug: query.categorySlug },
      });
    }

    if (query.brandSlug) {
      andConditions.push({
        brand: { slug: query.brandSlug },
      });
    }

    if (query.prescriptionRequired !== undefined) {
      andConditions.push({
        isPrescriptionRequired: query.prescriptionRequired,
      });
    }

    if (query.inStock === true) {
      andConditions.push({ stockQty: { gt: 0 } });
    }

    if (query.dosageForm) {
      andConditions.push({ dosageForm: query.dosageForm });
    }

    if (query.minPrice !== undefined) {
      andConditions.push({ price: { gte: query.minPrice } });
    }

    if (query.maxPrice !== undefined) {
      andConditions.push({ price: { lte: query.maxPrice } });
    }

    if (query.featured === true) {
      andConditions.push({ isFeatured: true });
    }

    if (query.hasDiscount === true) {
      andConditions.push({ discountPrice: { not: null } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  private buildOrderBy(
    sort?: ProductSort,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSort.PRICE_ASC:
        return [{ price: 'asc' }];
      case ProductSort.PRICE_DESC:
        return [{ price: 'desc' }];
      case ProductSort.NAME_ASC:
        return [{ name: 'asc' }];
      case ProductSort.LATEST:
      default:
        return [{ createdAt: 'desc' }];
    }
  }

  private async validateCategoryAndBrand(
    categoryId: string,
    brandId?: string | null,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brand) {
        throw new BadRequestException('Brand not found');
      }
    }
  }

  private validatePricing(price: number, discountPrice?: number | null) {
    if (discountPrice !== undefined && discountPrice !== null && discountPrice > price) {
      throw new BadRequestException('Discount price cannot exceed regular price');
    }
  }

  private formatProduct(product: any) {
    return {
      ...product,
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      tags: product.tags?.map((t: any) => t.tag) ?? [],
    };
  }

  private formatProductDetail(product: any) {
    const formatted = this.formatProduct(product);
    if (formatted.alternatives) {
      formatted.alternatives = formatted.alternatives.map((alt: any) => ({
        id: alt.alternative.id,
        name: alt.alternative.name,
        slug: alt.alternative.slug,
        price: Number(alt.alternative.price),
        discountPrice: alt.alternative.discountPrice
          ? Number(alt.alternative.discountPrice)
          : null,
        image: alt.alternative.images?.[0]?.imageUrl ?? null,
      }));
    }
    return formatted;
  }
}
