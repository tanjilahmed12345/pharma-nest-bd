import { WishlistsService } from './wishlists.service';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class WishlistsController {
    private wishlistsService;
    constructor(wishlistsService: WishlistsService);
    getWishlist(user: JwtPayload): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    addItem(user: JwtPayload, productId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    removeItem(user: JwtPayload, productId: string): Promise<{
        id: any;
        items: any;
        itemCount: any;
    }>;
    checkItem(user: JwtPayload, productId: string): Promise<{
        inWishlist: boolean;
    }>;
}
