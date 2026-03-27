import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class HealthService {
    private readonly config;
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    check(): Promise<{
        app: any;
        status: string;
        database: string;
        environment: any;
        timestamp: string;
    }>;
}
