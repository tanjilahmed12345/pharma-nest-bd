import { AdminPaymentQueryDto } from './dto/admin-payment-query.dto';
import { VerifyPaymentDto } from '../payments/dto/verify-payment.dto';
import { PaymentsService } from '../payments/payments.service';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminPaymentsController {
    private paymentsService;
    private prisma;
    constructor(paymentsService: PaymentsService, prisma: PrismaService);
    findAll(query: AdminPaymentQueryDto): Promise<{
        items: {
            id: string;
            method: import("@prisma/client").$Enums.PaymentMethod;
            senderNumber: string | null;
            transactionId: string | null;
            amount: number;
            status: import("@prisma/client").$Enums.PaymentStatus;
            orderNumber: string;
            customerName: string;
            customerPhone: string;
            createdAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        amount: number;
        order: {
            total: number;
            user: {
                id: string;
                email: string;
                phone: string;
                fullName: string;
            };
            id: string;
            orderStatus: import("@prisma/client").$Enums.OrderStatus;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            orderNumber: string;
        };
        verifiedBy: {
            id: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        } | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
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
    }>;
    verify(id: string, dto: VerifyPaymentDto, user: JwtPayload): Promise<{
        id: any;
        orderId: any;
        method: any;
        senderNumber: any;
        transactionId: any;
        amount: number;
        paymentTime: any;
        screenshotUrl: any;
        status: any;
        verificationNote: any;
        verifiedAt: any;
        createdAt: any;
    }>;
}
