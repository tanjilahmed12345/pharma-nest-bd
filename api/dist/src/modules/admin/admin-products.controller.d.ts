import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { AdminProductQueryDto } from './dto/admin-product-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminProductsController {
    private productsService;
    private prisma;
    constructor(productsService: ProductsService, prisma: PrismaService);
    findAll(query: AdminProductQueryDto): Promise<{
        items: {
            id: string;
            name: string;
            slug: string;
            genericName: string;
            category: {
                id: string;
                name: string;
                slug: string;
            };
            brand: {
                id: string;
                name: string;
                slug: string;
            } | null;
            price: number;
            discountPrice: number | null;
            stockQty: number;
            status: import("@prisma/client").$Enums.ProductStatus;
            isFeatured: boolean;
            isPrescriptionRequired: boolean;
            image: string;
            createdAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        price: number;
        discountPrice: number | null;
        costPrice: number | null;
        tags: string[];
        alternatives: {
            id: string;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            slug: string;
        };
        brand: {
            id: string;
            name: string;
            slug: string;
        } | null;
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            altText: string | null;
            isPrimary: boolean;
            productId: string;
        }[];
        description: string | null;
        id: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        manufacturerName: string;
        genericName: string;
        categoryId: string;
        brandId: string | null;
        dosageForm: import("@prisma/client").$Enums.DosageForm;
        strength: string;
        packSize: string;
        shortDescription: string | null;
        indications: string | null;
        dosageInstructions: string | null;
        sideEffects: string | null;
        warnings: string | null;
        storageInfo: string | null;
        sku: string | null;
        barcode: string | null;
        stockQty: number;
        minOrderQty: number;
        maxOrderQty: number;
        isPrescriptionRequired: boolean;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    create(dto: CreateProductDto): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<any>;
    toggleFeatured(id: string): Promise<any>;
    private buildSort;
}
