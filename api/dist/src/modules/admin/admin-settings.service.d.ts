import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class AdminSettingsService {
    private prisma;
    private auditLogs;
    constructor(prisma: PrismaService, auditLogs: AuditLogsService);
    getSettings(): Promise<{
        id: any;
        storeName: any;
        supportPhone: any;
        supportEmail: any;
        storeAddress: any;
        bkashNumber: any;
        nagadNumber: any;
        rocketNumber: any;
        codEnabled: any;
        baseDeliveryCharge: number;
        dhakaDeliveryCharge: number;
        outsideDhakaCharge: number;
        freeDeliveryThreshold: number | null;
        prescriptionPolicyText: any;
        footerText: any;
        updatedAt: any;
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        id: any;
        storeName: any;
        supportPhone: any;
        supportEmail: any;
        storeAddress: any;
        bkashNumber: any;
        nagadNumber: any;
        rocketNumber: any;
        codEnabled: any;
        baseDeliveryCharge: number;
        dhakaDeliveryCharge: number;
        outsideDhakaCharge: number;
        freeDeliveryThreshold: number | null;
        prescriptionPolicyText: any;
        footerText: any;
        updatedAt: any;
    }>;
    private formatSettings;
}
