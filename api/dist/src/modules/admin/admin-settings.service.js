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
exports.AdminSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminSettingsService = class AdminSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        let settings = await this.prisma.appSetting.findFirst();
        if (!settings) {
            settings = await this.prisma.appSetting.create({ data: {} });
        }
        return this.formatSettings(settings);
    }
    async updateSettings(dto) {
        let settings = await this.prisma.appSetting.findFirst();
        if (!settings) {
            settings = await this.prisma.appSetting.create({ data: dto });
        }
        else {
            settings = await this.prisma.appSetting.update({
                where: { id: settings.id },
                data: dto,
            });
        }
        return this.formatSettings(settings);
    }
    formatSettings(settings) {
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
};
exports.AdminSettingsService = AdminSettingsService;
exports.AdminSettingsService = AdminSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSettingsService);
//# sourceMappingURL=admin-settings.service.js.map