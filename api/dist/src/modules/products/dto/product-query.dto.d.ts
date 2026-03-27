import { DosageForm } from '../../../common/enums';
export declare enum ProductSort {
    LATEST = "latest",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    NAME_ASC = "name_asc"
}
export declare class ProductQueryDto {
    page?: number;
    limit?: number;
    q?: string;
    categorySlug?: string;
    brandSlug?: string;
    prescriptionRequired?: boolean;
    inStock?: boolean;
    dosageForm?: DosageForm;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    hasDiscount?: boolean;
    sort?: ProductSort;
}
