import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getActiveCategories(query: CategoryQueryDto) {
    const where: any = { isActive: true };

    if (query.rootOnly) {
      where.parentId = null;
    }
    if (query.parentId) {
      where.parentId = query.parentId;
    }

    const categories = await this.prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        ...(query.withCount && {
          _count: { select: { products: true } },
        }),
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        parent: true,
        _count: { select: { products: true } },
      },
    });

    if (!category || !category.isActive) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ── Admin ──

  async adminListCategories() {
    return this.prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('A category with this slug already exists');
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }

    return this.prisma.category.create({ data: dto });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('A category with this slug already exists');
      }
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products. Reassign products first.',
      );
    }
    if (category._count.children > 0) {
      throw new BadRequestException(
        'Cannot delete category with subcategories. Remove subcategories first.',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
