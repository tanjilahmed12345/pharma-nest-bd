"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BrandsService = class BrandsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveBrands() {
        return this.prisma.brand.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async getBrandBySlug(slug) {
        const brand = await this.prisma.brand.findUnique({ where: { slug } });
        if (!brand || !brand.isActive) {
            throw new common_1.NotFoundException('Brand not found');
        }
        return brand;
    }
    async adminListBrands() {
        return this.prisma.brand.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createBrand(dto) {
        const existing = await this.prisma.brand.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('A brand with this slug already exists');
        }
        return this.prisma.brand.create({ data: dto });
    }
    async updateBrand(id, dto) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        if (dto.slug && dto.slug !== brand.slug) {
            const existing = await this.prisma.brand.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('A brand with this slug already exists');
            }
        }
        return this.prisma.brand.update({ where: { id }, data: dto });
    }
    async deleteBrand(id) {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!brand) {
            throw new common_1.NotFoundException('Brand not found');
        }
        if (brand._count.products > 0) {
            throw new common_1.BadRequestException('Cannot delete brand with existing products. Reassign products first.');
        }
        await this.prisma.brand.delete({ where: { id } });
        return { message: 'Brand deleted successfully' };
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map