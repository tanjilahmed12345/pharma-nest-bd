import { PaymentMethod } from '../../../common/enums';
export declare class CheckoutPreviewDto {
    addressId: string;
    paymentMethod: PaymentMethod;
    prescriptionId?: string;
    customerNote?: string;
    couponCode?: string;
}
