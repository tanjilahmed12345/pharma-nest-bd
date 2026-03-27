import { IProductRepository } from '@/repositories/contracts';
import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Product, ProductFilters, PaginatedResponse } from '@/types';
import { generateId, nowISO, slugify } from '@/lib/utils';
import { AppError } from '@/lib/utils/app-error';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export const localProductRepository: IProductRepository = {
  async getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    let products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.genericName.toLowerCase().includes(q) ||
            p.manufacturer.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      if (filters.category) {
        products = products.filter((p) => p.categoryId === filters.category);
      }

      if (filters.brand) {
        products = products.filter((p) => p.brand === filters.brand);
      }

      if (filters.manufacturer) {
        products = products.filter((p) => p.manufacturer === filters.manufacturer);
      }

      if (filters.dosageForm) {
        products = products.filter((p) => p.dosageForm === filters.dosageForm);
      }

      if (filters.isPrescriptionRequired !== undefined) {
        products = products.filter(
          (p) => p.isPrescriptionRequired === filters.isPrescriptionRequired
        );
      }

      if (filters.isFeatured !== undefined) {
        products = products.filter((p) => p.isFeatured === filters.isFeatured);
      }

      if (filters.inStock) {
        products = products.filter((p) => p.stockQty > 0);
      }

      if (filters.priceMin !== undefined) {
        products = products.filter(
          (p) => (p.discountPrice || p.price) >= filters.priceMin!
        );
      }

      if (filters.priceMax !== undefined) {
        products = products.filter(
          (p) => (p.discountPrice || p.price) <= filters.priceMax!
        );
      }

      // Only show active products for public queries
      products = products.filter((p) => p.isActive);

      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            products.sort(
              (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
            );
            break;
          case 'price-desc':
            products.sort(
              (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
            );
            break;
          case 'name-asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'latest':
          default:
            products.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      }
    }

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || DEFAULT_PAGE_SIZE;
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = products.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    return products.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    return products.find((p) => p.id === id) || null;
  },

  async getFeatured(): Promise<Product[]> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    return products.filter((p) => p.isFeatured && p.isActive);
  },

  async search(query: string): Promise<Product[]> {
    const q = query.toLowerCase();
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    return products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(q) ||
          p.genericName.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  },

  async getRelated(productId: string, limit = 6): Promise<Product[]> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    const product = products.find((p) => p.id === productId);
    if (!product) return [];

    // Related = same category or same generic name, excluding self
    return products
      .filter(
        (p) =>
          p.id !== productId &&
          p.isActive &&
          (p.categoryId === product.categoryId ||
            p.genericName === product.genericName)
      )
      .slice(0, limit);
  },

  async create(data): Promise<Product> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    const product: Product = {
      ...data,
      id: `prod-${generateId()}`,
      slug: slugify(data.name),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    products.push(product);
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  async update(id, data): Promise<Product> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw AppError.notFound('Product');

    products[idx] = { ...products[idx], ...data, updatedAt: nowISO() };
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return products[idx];
  },

  async delete(id): Promise<void> {
    const products = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
    storage.set(
      STORAGE_KEYS.PRODUCTS,
      products.filter((p) => p.id !== id)
    );
  },
};
