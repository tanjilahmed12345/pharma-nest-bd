import { CartsService } from './carts.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class CartsController {
    private cartsService;
    constructor(cartsService: CartsService);
    getCart(user: JwtPayload): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    addItem(user: JwtPayload, dto: AddCartItemDto): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    updateItem(user: JwtPayload, id: string, dto: UpdateCartItemDto): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    removeItem(user: JwtPayload, id: string): Promise<{
        id: any;
        items: any;
        summary: {
            itemCount: any;
            totalQuantity: number;
            subtotal: number;
            hasPrescriptionItems: boolean;
        };
    }>;
    clearCart(user: JwtPayload): Promise<{
        message: string;
    }>;
}
