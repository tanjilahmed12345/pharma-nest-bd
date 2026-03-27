import { PrismaService } from '../../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ReviewPrescriptionDto } from './dto/review-prescription.dto';
import { PrescriptionQueryDto } from './dto/prescription-query.dto';
export declare class PrescriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPrescription(userId: string, dto: CreatePrescriptionDto): Promise<{
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
    getUserPrescriptions(userId: string, query: PrescriptionQueryDto): Promise<{
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
    getUserPrescriptionById(userId: string, id: string): Promise<{
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
    reviewPrescription(id: string, dto: ReviewPrescriptionDto, reviewerId: string): Promise<{
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
    private formatPrescription;
}
