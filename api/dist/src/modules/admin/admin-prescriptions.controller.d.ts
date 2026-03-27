import { AdminPrescriptionQueryDto } from './dto/admin-prescription-query.dto';
import { ReviewPrescriptionDto } from '../prescriptions/dto/review-prescription.dto';
import { PrescriptionsService } from '../prescriptions/prescriptions.service';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminPrescriptionsController {
    private prescriptionsService;
    private prisma;
    constructor(prescriptionsService: PrescriptionsService, prisma: PrismaService);
    findAll(query: AdminPrescriptionQueryDto): Promise<{
        items: {
            id: string;
            patientName: string;
            doctorName: string;
            issuedDate: Date | null;
            status: import("@prisma/client").$Enums.PrescriptionStatus;
            fileUrl: string | null;
            customerName: string;
            customerPhone: string;
            orderNumber: string;
            createdAt: Date;
            reviewedAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string;
            fullName: string;
        };
        orders: {
            id: string;
            orderStatus: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
        }[];
        items: ({
            product: {
                id: string;
                name: string;
                slug: string;
                genericName: string;
            };
        } & {
            id: string;
            status: string | null;
            productId: string;
            prescriptionId: string;
            note: string | null;
            requestedQty: number | null;
            approvedQty: number | null;
        })[];
        reviewedBy: {
            id: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        updatedAt: Date;
        fileName: string | null;
        userId: string;
        orderId: string | null;
        fileUrl: string | null;
        fileType: string | null;
        patientName: string;
        doctorName: string;
        issuedDate: Date | null;
        notes: string | null;
        pharmacistNote: string | null;
        reviewedById: string | null;
        reviewedAt: Date | null;
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
