export interface WishlistData {
  userId: string;
  productIds: string[];
}

export const seedWishlists: WishlistData[] = [
  {
    userId: 'user-cust-1',
    productIds: ['prod-23', 'prod-24', 'prod-40'],
  },
  {
    userId: 'user-cust-2',
    productIds: ['prod-26', 'prod-13', 'prod-20'],
  },
];
