import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(query: ProductQueryDto): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProductBySlug(slug: string): Promise<any>;
    getFeaturedProducts(limit?: number): Promise<any[]>;
    getOfferProducts(page?: number, limit?: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOtcProducts(page?: number, limit?: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRxProducts(page?: number, limit?: number): Promise<{
        items: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRelatedProducts(slug: string, limit?: number): Promise<any[]>;
    createProduct(dto: CreateProductDto): Promise<any>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<any>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<any>;
    toggleFeatured(id: string): Promise<any>;
    private buildPublicWhere;
    private buildOrderBy;
    private validateCategoryAndBrand;
    private validatePricing;
    private formatProduct;
    private formatProductDetail;
}
