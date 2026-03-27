import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    getActiveBrands(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }[]>;
    getBrandBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    adminListBrands(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    })[]>;
    createBrand(dto: CreateBrandDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    updateBrand(id: string, dto: UpdateBrandDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    deleteBrand(id: string): Promise<{
        message: string;
    }>;
}
