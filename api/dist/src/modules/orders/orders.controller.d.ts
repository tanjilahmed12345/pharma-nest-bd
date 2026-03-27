import { OrdersService } from './orders.service';
import { OrderQueryDto } from './dto/order-query.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    trackOrder(dto: TrackOrderDto): Promise<{
        orderNumber: string;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: number;
        itemCount: number;
        items: {
            name: string;
            quantity: number;
            lineTotal: number;
        }[];
        placedAt: Date;
        timeline: {
            from: import("@prisma/client").$Enums.OrderStatus | null;
            to: import("@prisma/client").$Enums.OrderStatus;
            note: string | null;
            at: Date;
        }[];
    }>;
    findAll(user: JwtPayload, query: OrderQueryDto): Promise<{
        items: {
            id: any;
            orderNumber: any;
            orderStatus: any;
            paymentStatus: any;
            paymentMethod: any;
            subtotal: number;
            deliveryFee: number;
            total: number;
            itemCount: any;
            items: any;
            placedAt: any;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(user: JwtPayload, id: string): Promise<{
        id: any;
        orderNumber: any;
        orderStatus: any;
        paymentStatus: any;
        paymentMethod: any;
        subtotal: number;
        discountTotal: number;
        deliveryFee: number;
        total: number;
        currency: any;
        customerNote: any;
        adminNote: any;
        placedAt: any;
        approvedAt: any;
        shippedAt: any;
        deliveredAt: any;
        cancelledAt: any;
        items: any;
        address: any;
        prescription: any;
        payments: any;
        timeline: any;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, user: JwtPayload): Promise<{
        id: any;
        orderNumber: any;
        orderStatus: any;
        paymentStatus: any;
        paymentMethod: any;
        subtotal: number;
        deliveryFee: number;
        total: number;
        itemCount: any;
        items: any;
        placedAt: any;
    }>;
}
