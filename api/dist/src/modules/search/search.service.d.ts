import { PrismaService } from '../../prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchProducts(query: SearchQueryDto): Promise<{
        items: {
            price: number;
            discountPrice: number | null;
            costPrice: number | null;
            tags: string[];
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
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
