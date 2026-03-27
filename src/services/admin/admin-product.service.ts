import { productRepository, categoryRepository } from '@/repositories';
import { Product, ProductFilters, Category, PaginatedResponse } from '@/types';

export const adminProductService = {
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    // Admin sees all products including inactive — override isActive filter
    return productRepository.getAll(filters);
  },

  getProductById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return productRepository.create(data);
  },

  updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return productRepository.update(id, data);
  },

  deleteProduct(id: string): Promise<void> {
    return productRepository.delete(id);
  },

  async toggleProductActive(id: string): Promise<Product> {
    const product = await productRepository.getById(id);
    if (!product) throw new Error('Product not found');
    return productRepository.update(id, { isActive: !product.isActive });
  },

  async toggleProductFeatured(id: string): Promise<Product> {
    const product = await productRepository.getById(id);
    if (!product) throw new Error('Product not found');
    return productRepository.update(id, { isFeatured: !product.isFeatured });
  },

  // Categories
  getCategories(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return categoryRepository.create(data);
  },

  updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return categoryRepository.update(id, data);
  },

  deleteCategory(id: string): Promise<void> {
    return categoryRepository.delete(id);
  },
};
