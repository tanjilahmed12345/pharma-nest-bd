import { AdminOrderQueryDto } from './dto/admin-order-query.dto';
import { UpdateAdminNoteDto } from './dto/update-admin-note.dto';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { OrdersService } from '../orders/orders.service';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminOrdersController {
    private ordersService;
    private prisma;
    constructor(ordersService: OrdersService, prisma: PrismaService);
    findAll(query: AdminOrderQueryDto): Promise<{
        items: {
            id: string;
            orderNumber: string;
            orderStatus: import("@prisma/client").$Enums.OrderStatus;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            total: number;
            itemCount: number;
            customerName: string;
            customerPhone: string;
            placedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        orderNumber: string;
        orderStatus: import("@prisma/client").$Enums.OrderStatus;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        subtotal: number;
        discountTotal: number;
        deliveryFee: number;
        total: number;
        currency: string;
        customerNote: string | null;
        adminNote: string | null;
        placedAt: Date;
        approvedAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        customer: {
            fullName: string;
            email: string;
            phone: string;
            id: string;
        };
        address: {
            division: string;
            district: string;
            phone: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isDefault: boolean;
            userId: string;
            label: import("@prisma/client").$Enums.AddressType;
            recipientName: string;
            alternatePhone: string | null;
            upazilaThana: string;
            postcode: string;
            area: string;
            addressLine: string;
            houseFlat: string;
            landmark: string | null;
            deliveryNote: string | null;
        } | null;
        prescription: {
            id: string;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            fileUrl: string | null;
            patientName: string;
            doctorName: string;
            pharmacistNote: string | null;
        } | null;
        items: {
            unitPrice: number;
            discountAmount: number;
            lineTotal: number;
            id: string;
            createdAt: Date;
            productId: string | null;
            quantity: number;
            orderId: string;
            productNameSnapshot: string;
            genericNameSnapshot: string | null;
            manufacturerSnapshot: string | null;
            strengthSnapshot: string | null;
            packSizeSnapshot: string | null;
            skuSnapshot: string | null;
            imageSnapshot: string | null;
            requiresPrescription: boolean;
        }[];
        payments: {
            amount: number;
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            senderNumber: string | null;
            transactionId: string | null;
            paymentTime: Date | null;
            screenshotUrl: string | null;
            orderId: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            verificationNote: string | null;
            verifiedAt: Date | null;
            verifiedById: string | null;
        }[];
        timeline: {
            id: string;
            from: import("@prisma/client").$Enums.OrderStatus | null;
            to: import("@prisma/client").$Enums.OrderStatus;
            note: string | null;
            at: Date;
            changedBy: {
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
            } | null;
        }[];
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
    updateNote(id: string, dto: UpdateAdminNoteDto): Promise<{
        id: string;
        orderNumber: string;
        adminNote: string | null;
    }>;
}
