import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { AdminProductQueryDto, AdminProductSort } from './dto/admin-product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ADMIN_PAGE_SIZE } from '../../common/constants';
import { Prisma } from '@prisma/client';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/products')
export class AdminProductsController {
  constructor(
    private productsService: ProductsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all products (admin)' })
  async findAll(@Query() query: AdminProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? ADMIN_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (query.q) {
      andConditions.push({
        OR: [
          { name: { contains: query.q, mode: 'insensitive' } },
          { genericName: { contains: query.q, mode: 'insensitive' } },
          { sku: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }
    if (query.status) andConditions.push({ status: query.status });
    if (query.categoryId) andConditions.push({ categoryId: query.categoryId });
    if (query.brandId) andConditions.push({ brandId: query.brandId });
    if (query.featured !== undefined) andConditions.push({ isFeatured: query.featured });
    if (query.prescriptionRequired !== undefined) {
      andConditions.push({ isPrescriptionRequired: query.prescriptionRequired });
    }
    if (query.lowStock) andConditions.push({ stockQty: { lt: 10 } });
    if (andConditions.length > 0) where.AND = andConditions;

    const orderBy = this.buildSort(query.sort);

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        genericName: p.genericName,
        category: p.category,
        brand: p.brand,
        price: Number(p.price),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
        stockQty: p.stockQty,
        status: p.status,
        isFeatured: p.isFeatured,
        isPrescriptionRequired: p.isPrescriptionRequired,
        image: p.images?.[0]?.imageUrl ?? null,
        createdAt: p.createdAt,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail for editing (admin)' })
  async findOne(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        tags: { select: { tag: true } },
        alternatives: {
          include: {
            alternative: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      tags: product.tags.map((t) => t.tag),
      alternatives: product.alternatives.map((a) => a.alternative),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create product (admin)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product (admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (admin)' })
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle product active/inactive (admin)' })
  async toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(id);
  }

  @Patch(':id/toggle-featured')
  @ApiOperation({ summary: 'Toggle product featured (admin)' })
  async toggleFeatured(@Param('id') id: string) {
    return this.productsService.toggleFeatured(id);
  }

  private buildSort(sort?: AdminProductSort): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case AdminProductSort.NAME_ASC:
        return [{ name: 'asc' }];
      case AdminProductSort.PRICE_ASC:
        return [{ price: 'asc' }];
      case AdminProductSort.PRICE_DESC:
        return [{ price: 'desc' }];
      case AdminProductSort.STOCK_ASC:
        return [{ stockQty: 'asc' }];
      case AdminProductSort.STOCK_DESC:
        return [{ stockQty: 'desc' }];
      default:
        return [{ createdAt: 'desc' }];
    }
  }
}
