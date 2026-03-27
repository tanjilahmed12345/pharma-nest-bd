import { PrismaService } from '../../prisma/prisma.service';
export declare class WishlistsService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    addItem(userId: string, productId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    isInWishlist(userId: string, productId: string): Promise<{
        inWishlist: boolean;
    }>;
    private getOrCreateWishlist;
    private buildWishlistResponse;
}
