import { ICategoryRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Category } from '@/types';
import { generateId, nowISO, slugify } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';

export const localCategoryRepository: ICategoryRepository = {
  async getAll(): Promise<Category[]> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getActive(): Promise<Category[]> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    return categories
      .filter((c) => c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    return categories.find((c) => c.slug === slug) || null;
  },

  async create(data): Promise<Category> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const category: Category = {
      ...data,
      id: `cat-${generateId()}`,
      slug: slugify(data.name),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    categories.push(category);
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  async update(id, data): Promise<Category> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw AppError.notFound('Category');
    categories[idx] = { ...categories[idx], ...data, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  },

  async delete(id): Promise<void> {
    const categories = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    storage.set(
      STORAGE_KEYS.CATEGORIES,
      categories.filter((c) => c.id !== id)
    );
  },
};
