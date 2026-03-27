import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const WISHLIST_INCLUDE = {
  items: {
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
};

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);
    return this.buildWishlistResponse(wishlist);
  }

  async addItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.status !== 'ACTIVE') {
      throw new BadRequestException('Product is not available');
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product is already in your wishlist');
    }

    await this.prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (!item) {
      throw new BadRequestException('Product is not in your wishlist');
    }

    await this.prisma.wishlistItem.delete({ where: { id: item.id } });
    return this.getWishlist(userId);
  }

  async isInWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) return { inWishlist: false };

    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    return { inWishlist: !!item };
  }

  private async getOrCreateWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: WISHLIST_INCLUDE,
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: WISHLIST_INCLUDE,
      });
    }

    return wishlist;
  }

  private buildWishlistResponse(wishlist: any) {
    const items = wishlist.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        genericName: item.product.genericName,
        strength: item.product.strength,
        packSize: item.product.packSize,
        price: Number(item.product.price),
        discountPrice: item.product.discountPrice
          ? Number(item.product.discountPrice)
          : null,
        stockQty: item.product.stockQty,
        isPrescriptionRequired: item.product.isPrescriptionRequired,
        status: item.product.status,
        image: item.product.images?.[0]?.imageUrl ?? null,
        category: item.product.category,
        brand: item.product.brand,
      },
    }));

    return {
      id: wishlist.id,
      items,
      itemCount: items.length,
    };
  }
}
