import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(query: ProductQueryDto): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFeatured(limit: number): Promise<any[]>;
    getOffers(page: number, limit: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOtc(page: number, limit: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRx(page: number, limit: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<any>;
    getRelated(slug: string, limit: number): Promise<any[]>;
    create(dto: CreateProductDto): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<any>;
    toggleFeatured(id: string): Promise<any>;
}
