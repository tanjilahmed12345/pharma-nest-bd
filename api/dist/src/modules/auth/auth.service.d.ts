import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private auditLogs;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, auditLogs: AuditLogsService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            id: string;
            createdAt: Date;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            id: string;
            createdAt: Date;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            id: string;
            createdAt: Date;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            fullName: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            updatedAt: Date;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<Omit<{
        addresses: {
            division: string;
            district: string;
            id: string;
            createdAt: Date;
            phone: string;
            updatedAt: Date;
            isDefault: boolean;
            userId: string;
            label: import("@prisma/client").$Enums.AddressType;
            recipientName: string;
            alternatePhone: string | null;
            upazilaThana: string;
            postcode: string;
            area: string;
            addressLine: string;
            houseFlat: string;
            landmark: string | null;
            deliveryNote: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        email: string;
        phone: string;
        passwordHash: string;
        refreshTokenHash: string | null;
        fullName: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        avatar: string | null;
        emailVerifiedAt: Date | null;
        phoneVerifiedAt: Date | null;
        lastLoginAt: Date | null;
        updatedAt: Date;
    }, "passwordHash" | "refreshTokenHash">>;
    private generateTokens;
    private updateRefreshTokenHash;
}
