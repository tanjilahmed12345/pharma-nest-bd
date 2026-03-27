import { Category } from '@/types';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getActive(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(id: string, data: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
