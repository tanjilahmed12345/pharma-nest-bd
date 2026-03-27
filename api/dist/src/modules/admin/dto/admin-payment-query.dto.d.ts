import { PaymentStatus, PaymentMethod } from '../../../common/enums';
export declare class AdminPaymentQueryDto {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
    q?: string;
    fromDate?: string;
    toDate?: string;
}
