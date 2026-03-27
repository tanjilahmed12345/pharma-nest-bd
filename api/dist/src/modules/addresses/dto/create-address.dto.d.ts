import { AddressType } from '../../../common/enums';
export declare class CreateAddressDto {
    label?: AddressType;
    recipientName: string;
    phone: string;
    alternatePhone?: string;
    division: string;
    district: string;
    upazilaThana: string;
    postcode: string;
    area: string;
    addressLine: string;
    houseFlat: string;
    landmark?: string;
    deliveryNote?: string;
    isDefault?: boolean;
}
