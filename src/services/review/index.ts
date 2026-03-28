import { storage } from '@/lib/storage/local-storage';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { Review, ReviewSummary } from '@/types';
import { generateId, nowISO } from '@/lib/utils';

export const reviewService = {
  getProductReviews(productId: string): Review[] {
    const reviews = storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    return reviews
      .filter((r) => r.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReviewSummary(productId: string): ReviewSummary {
    const reviews = this.getProductReviews(productId);
    const total = reviews.length;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    let sum = 0;
    reviews.forEach((r) => {
      sum += r.rating;
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return {
      averageRating: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
      totalReviews: total,
      distribution,
    };
  },

  addReview(data: {
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
  }): Review {
    const reviews = storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    const review: Review = {
      id: `rev-${generateId()}`,
      ...data,
      isVerifiedPurchase: true,
      createdAt: nowISO(),
    };
    reviews.push(review);
    storage.set(STORAGE_KEYS.REVIEWS, reviews);
    return review;
  },

  hasUserReviewed(productId: string, userId: string): boolean {
    const reviews = storage.get<Review[]>(STORAGE_KEYS.REVIEWS) || [];
    return reviews.some((r) => r.productId === productId && r.userId === userId);
  },
};
