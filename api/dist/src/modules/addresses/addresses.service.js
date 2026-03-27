"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AddressesService = class AddressesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async create(userId, dto) {
        if (dto.isDefault) {
            await this.clearDefaultAddresses(userId);
        }
        const count = await this.prisma.address.count({ where: { userId } });
        const isDefault = dto.isDefault ?? count === 0;
        return this.prisma.address.create({
            data: {
                userId,
                label: dto.label,
                recipientName: dto.recipientName,
                phone: dto.phone,
                alternatePhone: dto.alternatePhone,
                division: dto.division,
                district: dto.district,
                upazilaThana: dto.upazilaThana,
                postcode: dto.postcode,
                area: dto.area,
                addressLine: dto.addressLine,
                houseFlat: dto.houseFlat,
                landmark: dto.landmark,
                deliveryNote: dto.deliveryNote,
                isDefault,
            },
        });
    }
    async update(userId, addressId, dto) {
        const address = await this.findUserAddress(userId, addressId);
        if (dto.isDefault) {
            await this.clearDefaultAddresses(userId);
        }
        return this.prisma.address.update({
            where: { id: address.id },
            data: dto,
        });
    }
    async remove(userId, addressId) {
        const address = await this.findUserAddress(userId, addressId);
        await this.prisma.address.delete({ where: { id: address.id } });
        if (address.isDefault) {
            const nextDefault = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextDefault) {
                await this.prisma.address.update({
                    where: { id: nextDefault.id },
                    data: { isDefault: true },
                });
            }
        }
        return { message: 'Address deleted successfully' };
    }
    async setDefault(userId, addressId) {
        await this.findUserAddress(userId, addressId);
        await this.clearDefaultAddresses(userId);
        return this.prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        });
    }
    async findUserAddress(userId, addressId) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (address.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this address');
        }
        return address;
    }
    async clearDefaultAddresses(userId) {
        await this.prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map