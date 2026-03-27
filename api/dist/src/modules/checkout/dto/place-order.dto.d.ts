import { PaymentMethod } from '../../../common/enums';
import { PaymentInputDto } from './payment-input.dto';
export declare class PlaceOrderDto {
    addressId: string;
    paymentMethod: PaymentMethod;
    prescriptionId?: string;
    customerNote?: string;
    paymentInput?: PaymentInputDto;
}
