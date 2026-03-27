export interface IWishlistRepository {
  getWishlist(userId: string): Promise<string[]>;
  addItem(userId: string, productId: string): Promise<string[]>;
  removeItem(userId: string, productId: string): Promise<string[]>;
  hasItem(userId: string, productId: string): Promise<boolean>;
  clearWishlist(userId: string): Promise<void>;
}
