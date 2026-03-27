import { productRepository, categoryRepository } from '@/repositories';
import { Product, ProductFilters, Category, PaginatedResponse } from '@/types';

export const catalogService = {
  // Products
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return productRepository.getAll(filters);
  },

  getProductBySlug(slug: string): Promise<Product | null> {
    return productRepository.getBySlug(slug);
  },

  getProductById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  getFeaturedProducts(): Promise<Product[]> {
    return productRepository.getFeatured();
  },

  searchProducts(query: string): Promise<Product[]> {
    return productRepository.search(query);
  },

  getRelatedProducts(productId: string, limit?: number): Promise<Product[]> {
    return productRepository.getRelated(productId, limit);
  },

  getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return productRepository.getAll({ ...filters, category: categoryId });
  },

  getOtcProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return productRepository.getAll({ ...filters, isPrescriptionRequired: false });
  },

  getRxProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return productRepository.getAll({ ...filters, isPrescriptionRequired: true });
  },

  // Categories
  getCategories(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  getActiveCategories(): Promise<Category[]> {
    return categoryRepository.getActive();
  },

  getCategoryBySlug(slug: string): Promise<Category | null> {
    return categoryRepository.getBySlug(slug);
  },
};
