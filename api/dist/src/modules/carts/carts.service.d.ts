import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    addItem(userId: string, dto: AddCartItemDto): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    getOrCreateCart(userId: string): Promise<{
        items: ({
            product: {
                images: {
                    id: string;
                    imageUrl: string;
                    sortOrder: number;
                    altText: string | null;
                    isPrimary: boolean;
                    productId: string;
                }[];
            } & {
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
                price: import("@prisma/client-runtime-utils").Decimal;
                discountPrice: import("@prisma/client-runtime-utils").Decimal | null;
                costPrice: import("@prisma/client-runtime-utils").Decimal | null;
                sku: string | null;
                barcode: string | null;
                stockQty: number;
                minOrderQty: number;
                maxOrderQty: number;
                isPrescriptionRequired: boolean;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
            unitPriceSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    private buildCartResponse;
}
