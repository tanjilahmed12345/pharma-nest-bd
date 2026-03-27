import { ProductStatus } from '../../../common/enums';
export declare enum AdminProductSort {
    LATEST = "latest",
    NAME_ASC = "name_asc",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    STOCK_ASC = "stock_asc",
    STOCK_DESC = "stock_desc"
}
export declare class AdminProductQueryDto {
    page?: number;
    limit?: number;
    q?: string;
    categoryId?: string;
    brandId?: string;
    status?: ProductStatus;
    featured?: boolean;
    prescriptionRequired?: boolean;
    lowStock?: boolean;
    sort?: AdminProductSort;
}
