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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getActiveCategories(query) {
        const where = { isActive: true };
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
    async getCategoryBySlug(slug) {
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
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async adminListCategories() {
        return this.prisma.category.findMany({
            include: {
                parent: { select: { id: true, name: true } },
                _count: { select: { products: true, children: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async createCategory(dto) {
        const existing = await this.prisma.category.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('A category with this slug already exists');
        }
        if (dto.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: dto.parentId },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
            }
        }
        return this.prisma.category.create({ data: dto });
    }
    async updateCategory(id, dto) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (dto.slug && dto.slug !== category.slug) {
            const existing = await this.prisma.category.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new common_1.ConflictException('A category with this slug already exists');
            }
        }
        if (dto.parentId) {
            if (dto.parentId === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            const parent = await this.prisma.category.findUnique({
                where: { id: dto.parentId },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
            }
        }
        return this.prisma.category.update({ where: { id }, data: dto });
    }
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true, children: true } } },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category._count.products > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing products. Reassign products first.');
        }
        if (category._count.children > 0) {
            throw new common_1.BadRequestException('Cannot delete category with subcategories. Remove subcategories first.');
        }
        await this.prisma.category.delete({ where: { id } });
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map