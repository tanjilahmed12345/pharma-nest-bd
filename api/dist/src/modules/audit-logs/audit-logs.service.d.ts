import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction } from '../../common/enums';
interface LogParams {
    actorUserId?: string;
    actionType: AuditAction;
    entityType: string;
    entityId?: string;
    details?: Record<string, any>;
}
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: LogParams): Promise<void>;
    getRecentLogs(limit?: number): Promise<({
        actor: {
            id: string;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
        } | null;
    } & {
        id: string;
        actionType: import("@prisma/client").$Enums.AuditAction;
        entityType: string;
        entityId: string | null;
        detailsJson: Prisma.JsonValue | null;
        createdAt: Date;
        actorUserId: string | null;
    })[]>;
}
export {};
