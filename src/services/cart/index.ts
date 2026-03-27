import { productRepository } from '@/repositories';
import { useCartStore } from '@/store/cart.store';
import { Product, OrderPreview } from '@/types';
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
}

export const cartService = {
  addItem(productId: string, quantity = 1): void {
    useCartStore.getState().addItem(productId, quantity);
  },

  removeItem(productId: string): void {
    useCartStore.getState().removeItem(productId);
  },

  updateQuantity(productId: string, quantity: number): void {
    useCartStore.getState().updateQuantity(productId, quantity);
  },

  clearCart(): void {
    useCartStore.getState().clearCart();
  },

  setCoupon(code: string | undefined): void {
    useCartStore.getState().setCoupon(code);
  },

  getItemCount(): number {
    return useCartStore.getState().getItemCount();
  },

  /**
   * Resolve cart items with full product data.
   */
  async getCartItemsWithProducts(): Promise<CartItemWithProduct[]> {
    const { cart } = useCartStore.getState();
    const resolved: CartItemWithProduct[] = [];

    for (const item of cart.items) {
      const product = await productRepository.getById(item.productId);
      if (product) {
        resolved.push({ ...item, product });
      }
    }

    return resolved;
  },

  /**
   * Compute a full order preview from the current cart.
   */
  async computeOrderPreview(): Promise<OrderPreview> {
    const items = await this.getCartItemsWithProducts();
    const warnings: string[] = [];

    let subtotal = 0;
    let discount = 0;
    let itemCount = 0;
    let hasPrescriptionItems = false;

    const orderItems = items.map((ci) => {
      const effectivePrice = ci.product.discountPrice || ci.product.price;
      subtotal += effectivePrice * ci.quantity;
      itemCount += ci.quantity;

      if (ci.product.discountPrice) {
        discount += (ci.product.price - ci.product.discountPrice) * ci.quantity;
      }

      if (ci.product.isPrescriptionRequired) {
        hasPrescriptionItems = true;
      }

      if (ci.product.stockQty < ci.quantity) {
        warnings.push(
          `${ci.product.name} has only ${ci.product.stockQty} units in stock`
        );
      }

      return {
        productId: ci.product.id,
        productName: ci.product.name,
        genericName: ci.product.genericName,
        manufacturer: ci.product.manufacturer,
        strength: ci.product.strength,
        packSize: ci.product.packSize,
        price: ci.product.price,
        discountPrice: ci.product.discountPrice,
        quantity: ci.quantity,
        isPrescriptionRequired: ci.product.isPrescriptionRequired,
        image: ci.product.image,
      };
    });

    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    if (hasPrescriptionItems) {
      warnings.push('This order contains prescription medicines. A valid prescription is required.');
    }

    return {
      items: orderItems,
      itemCount,
      subtotal,
      discount,
      deliveryCharge,
      total,
      hasPrescriptionItems,
      warnings,
    };
  },
};
