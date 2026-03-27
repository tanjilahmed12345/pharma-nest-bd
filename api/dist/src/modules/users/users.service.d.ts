import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<Omit<{
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
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<Omit<{
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
