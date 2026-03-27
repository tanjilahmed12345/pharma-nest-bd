import { Product, ProductFilters, PaginatedResponse } from '@/types';

export interface IProductRepository {
  getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getFeatured(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  getRelated(productId: string, limit?: number): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
