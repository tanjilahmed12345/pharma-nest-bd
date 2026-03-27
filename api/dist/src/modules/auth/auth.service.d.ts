import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            fullName: string;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            fullName: string;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }, "passwordHash" | "refreshTokenHash">;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Omit<{
            fullName: string;
            email: string;
            phone: string;
            passwordHash: string;
            refreshTokenHash: string | null;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            avatar: string | null;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
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
            phone: string;
            id: string;
            createdAt: Date;
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
        fullName: string;
        email: string;
        phone: string;
        passwordHash: string;
        refreshTokenHash: string | null;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        status: import("@prisma/client").$Enums.UserStatus;
        avatar: string | null;
        emailVerifiedAt: Date | null;
        phoneVerifiedAt: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, "passwordHash" | "refreshTokenHash">>;
    private generateTokens;
    private updateRefreshTokenHash;
}
