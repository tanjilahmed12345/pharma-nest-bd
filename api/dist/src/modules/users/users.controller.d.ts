import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: JwtPayload): Promise<Omit<{
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
    updateProfile(user: JwtPayload, dto: UpdateProfileDto): Promise<Omit<{
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
