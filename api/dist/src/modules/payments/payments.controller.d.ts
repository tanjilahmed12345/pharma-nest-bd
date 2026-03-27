import { PaymentsService } from './payments.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    submit(user: JwtPayload, dto: SubmitPaymentDto): Promise<{
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
    getOrderPayments(user: JwtPayload, orderId: string): Promise<{
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
