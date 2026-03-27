import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ReviewPrescriptionDto } from './dto/review-prescription.dto';
import { PrescriptionQueryDto } from './dto/prescription-query.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class PrescriptionsController {
    private prescriptionsService;
    constructor(prescriptionsService: PrescriptionsService);
    create(user: JwtPayload, dto: CreatePrescriptionDto): Promise<{
        id: any;
        patientName: any;
        doctorName: any;
        fileUrl: any;
        fileName: any;
        fileType: any;
        issuedDate: any;
        notes: any;
        status: any;
        pharmacistNote: any;
        reviewedBy: {
            name: any;
            role: any;
        } | null;
        reviewedAt: any;
        orders: any;
        items: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(user: JwtPayload, query: PrescriptionQueryDto): Promise<{
        items: {
            id: any;
            patientName: any;
            doctorName: any;
            fileUrl: any;
            fileName: any;
            fileType: any;
            issuedDate: any;
            notes: any;
            status: any;
            pharmacistNote: any;
            reviewedBy: {
                name: any;
                role: any;
            } | null;
            reviewedAt: any;
            orders: any;
            items: any;
            createdAt: any;
            updatedAt: any;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(user: JwtPayload, id: string): Promise<{
        id: any;
        patientName: any;
        doctorName: any;
        fileUrl: any;
        fileName: any;
        fileType: any;
        issuedDate: any;
        notes: any;
        status: any;
        pharmacistNote: any;
        reviewedBy: {
            name: any;
            role: any;
        } | null;
        reviewedAt: any;
        orders: any;
        items: any;
        createdAt: any;
        updatedAt: any;
    }>;
    review(id: string, dto: ReviewPrescriptionDto, user: JwtPayload): Promise<{
        id: any;
        patientName: any;
        doctorName: any;
        fileUrl: any;
        fileName: any;
        fileType: any;
        issuedDate: any;
        notes: any;
        status: any;
        pharmacistNote: any;
        reviewedBy: {
            name: any;
            role: any;
        } | null;
        reviewedAt: any;
        orders: any;
        items: any;
        createdAt: any;
        updatedAt: any;
    }>;
}
