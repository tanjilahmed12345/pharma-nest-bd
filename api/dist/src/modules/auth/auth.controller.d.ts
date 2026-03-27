import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    refresh(_dto: RefreshTokenDto, user: JwtPayload & {
        refreshToken: string;
    }): Promise<{
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
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
    getMe(user: JwtPayload): Promise<Omit<{
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
}
