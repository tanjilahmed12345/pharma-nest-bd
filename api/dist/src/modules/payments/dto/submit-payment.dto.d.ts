import { PaymentMethod } from '../../../common/enums';
export declare class SubmitPaymentDto {
    orderId: string;
    method: PaymentMethod;
    senderNumber: string;
    transactionId: string;
    amount?: number;
    paymentTime?: string;
    screenshotUrl?: string;
}
