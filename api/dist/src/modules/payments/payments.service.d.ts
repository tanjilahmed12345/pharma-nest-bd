import { PrismaService } from '../../prisma/prisma.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    submitPayment(userId: string, dto: SubmitPaymentDto): Promise<{
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
    getOrderPayments(userId: string, orderId: string): Promise<{
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
    }[]>;
    verifyPayment(id: string, dto: VerifyPaymentDto, verifierId: string): Promise<{
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
    private formatPayment;
}
