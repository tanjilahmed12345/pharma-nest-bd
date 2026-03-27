import { DosageForm, ProductStatus } from '../../../common/enums';
export declare class ProductImageDto {
    imageUrl: string;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    genericName: string;
    categoryId: string;
    brandId?: string;
    manufacturerName: string;
    dosageForm?: DosageForm;
    strength: string;
    packSize: string;
    shortDescription?: string;
    description?: string;
    indications?: string;
    dosageInstructions?: string;
    sideEffects?: string;
    warnings?: string;
    storageInfo?: string;
    price: number;
    discountPrice?: number;
    costPrice?: number;
    sku?: string;
    barcode?: string;
    stockQty?: number;
    minOrderQty?: number;
    maxOrderQty?: number;
    isPrescriptionRequired?: boolean;
    status?: ProductStatus;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    images?: ProductImageDto[];
    tags?: string[];
}
