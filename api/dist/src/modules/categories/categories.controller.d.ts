import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(query: CategoryQueryDto): Promise<({
        _count: {
            parent: number;
            children: number;
            products: number;
        };
        children: {
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
        }[];
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
    findBySlug(slug: string): Promise<{
        _count: {
            products: number;
        };
        parent: {
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
        } | null;
        children: {
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
        }[];
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
