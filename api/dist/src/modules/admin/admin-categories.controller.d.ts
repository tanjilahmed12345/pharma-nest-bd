import { CategoriesService } from '../categories/categories.service';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
export declare class AdminCategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        _count: {
            children: number;
            products: number;
        };
        parent: {
            id: string;
            name: string;
        } | null;
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            children: number;
            products: number;
        };
        parent: {
            id: string;
            name: string;
        } | null;
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
