import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../../common/enums';

@Injectable()
export class AdminSettingsService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) {}

  async getSettings() {
    let settings = await this.prisma.appSetting.findFirst();

    if (!settings) {
      settings = await this.prisma.appSetting.create({ data: {} });
    }

    return this.formatSettings(settings);
  }

  async updateSettings(dto: UpdateSettingsDto) {
    let settings = await this.prisma.appSetting.findFirst();

    if (!settings) {
      settings = await this.prisma.appSetting.create({ data: dto });
    } else {
      settings = await this.prisma.appSetting.update({
        where: { id: settings.id },
        data: dto,
      });
    }

    this.auditLogs.log({
      actionType: AuditAction.UPDATE,
      entityType: 'AppSetting',
      entityId: settings.id,
      details: { updatedFields: Object.keys(dto) },
    });

    return this.formatSettings(settings);
  }

  private formatSettings(settings: any) {
    return {
      id: settings.id,
      storeName: settings.storeName,
      supportPhone: settings.supportPhone,
      supportEmail: settings.supportEmail,
      storeAddress: settings.storeAddress,
      bkashNumber: settings.bkashNumber,
      nagadNumber: settings.nagadNumber,
      rocketNumber: settings.rocketNumber,
      codEnabled: settings.codEnabled,
      baseDeliveryCharge: Number(settings.baseDeliveryCharge),
      dhakaDeliveryCharge: Number(settings.dhakaDeliveryCharge),
      outsideDhakaCharge: Number(settings.outsideDhakaCharge),
      freeDeliveryThreshold: settings.freeDeliveryThreshold
        ? Number(settings.freeDeliveryThreshold)
        : null,
      prescriptionPolicyText: settings.prescriptionPolicyText,
      footerText: settings.footerText,
      updatedAt: settings.updatedAt,
    };
  }
}
