import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): Promise<{
        app: any;
        status: string;
        database: string;
        environment: any;
        timestamp: string;
    }>;
}
