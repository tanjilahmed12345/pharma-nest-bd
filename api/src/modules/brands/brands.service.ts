import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async getActiveBrands() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getBrandBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({ where: { slug } });
    if (!brand || !brand.isActive) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  // ── Admin ──

  async adminListBrands() {
    return this.prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createBrand(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('A brand with this slug already exists');
    }

    return this.prisma.brand.create({ data: dto });
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (dto.slug && dto.slug !== brand.slug) {
      const existing = await this.prisma.brand.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('A brand with this slug already exists');
      }
    }

    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async deleteBrand(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (brand._count.products > 0) {
      throw new BadRequestException(
        'Cannot delete brand with existing products. Reassign products first.',
      );
    }

    await this.prisma.brand.delete({ where: { id } });
    return { message: 'Brand deleted successfully' };
  }
}
