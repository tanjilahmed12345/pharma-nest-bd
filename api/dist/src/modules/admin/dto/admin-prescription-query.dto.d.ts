import { PrescriptionStatus } from '../../../common/enums';
export declare class AdminPrescriptionQueryDto {
    page?: number;
    limit?: number;
    status?: PrescriptionStatus;
    q?: string;
    fromDate?: string;
    toDate?: string;
}
