import { OrderStatus, PaymentStatus, PaymentMethod } from '../../../common/enums';
export declare class AdminOrderQueryDto {
    page?: number;
    limit?: number;
    q?: string;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    fromDate?: string;
    toDate?: string;
}
