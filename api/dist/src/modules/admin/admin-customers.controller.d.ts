import { AdminCustomersService } from './admin-customers.service';
import { CustomerQueryDto } from './dto/customer-query.dto';
export declare class AdminCustomersController {
    private customersService;
    constructor(customersService: AdminCustomersService);
    findAll(query: CustomerQueryDto): Promise<{
        items: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            totalOrders: number;
            totalSpent: number;
            lastOrderAt: Date;
            createdAt: Date;
            lastLoginAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
