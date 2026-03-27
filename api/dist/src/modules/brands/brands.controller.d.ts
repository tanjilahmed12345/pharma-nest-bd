import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private brandsService;
    constructor(brandsService: BrandsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    create(dto: CreateBrandDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    update(id: string, dto: UpdateBrandDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        isActive: boolean;
        manufacturerName: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
