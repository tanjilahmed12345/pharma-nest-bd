import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.clearDefaultAddresses(userId);
    }

    // If this is the user's first address, make it default
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

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.findUserAddress(userId, addressId);

    if (dto.isDefault) {
      await this.clearDefaultAddresses(userId);
    }

    return this.prisma.address.update({
      where: { id: address.id },
      data: dto,
    });
  }

  async remove(userId: string, addressId: string) {
    const address = await this.findUserAddress(userId, addressId);

    await this.prisma.address.delete({ where: { id: address.id } });

    // If deleted address was default, promote the most recent one
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

  async setDefault(userId: string, addressId: string) {
    await this.findUserAddress(userId, addressId);
    await this.clearDefaultAddresses(userId);

    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  private async findUserAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }

    return address;
  }

  private async clearDefaultAddresses(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
