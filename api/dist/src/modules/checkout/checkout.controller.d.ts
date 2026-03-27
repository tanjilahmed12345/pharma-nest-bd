import { CheckoutService } from './checkout.service';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class CheckoutController {
    private checkoutService;
    constructor(checkoutService: CheckoutService);
    preview(user: JwtPayload, dto: CheckoutPreviewDto): Promise<{
        items: {
            productId: any;
            name: any;
            slug: any;
            genericName: any;
            strength: any;
            packSize: any;
            price: number;
            discountPrice: number | null;
            quantity: any;
            lineTotal: number;
            isPrescriptionRequired: any;
            image: any;
        }[];
        address: {
            id: string;
            label: import("@prisma/client").$Enums.AddressType;
            recipientName: string;
            phone: string;
            division: string;
            district: string;
            upazilaThana: string;
            area: string;
            addressLine: string;
        };
        paymentMethod: import("../../common/enums").PaymentMethod;
        summary: {
            itemCount: number;
            totalQuantity: any;
            subtotal: number;
            discountTotal: number;
            deliveryFee: number;
            total: number;
            hasPrescriptionItems: boolean;
            prescriptionLinked: boolean;
        };
        warnings: string[] | undefined;
    }>;
    placeOrder(user: JwtPayload, dto: PlaceOrderDto): Promise<{
        id: string;
        orderNumber: string;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        subtotal: number;
        discountTotal: number;
        deliveryFee: number;
        total: number;
        itemCount: number;
        prescriptionLinked: boolean;
        createdAt: Date;
    }>;
}
