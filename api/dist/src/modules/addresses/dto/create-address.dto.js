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
exports.CreateAddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enums_1 = require("../../../common/enums");
class CreateAddressDto {
    label;
    recipientName;
    phone;
    alternatePhone;
    division;
    district;
    upazilaThana;
    postcode;
    area;
    addressLine;
    houseFlat;
    landmark;
    deliveryNote;
    isDefault;
}
exports.CreateAddressDto = CreateAddressDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.AddressType, default: enums_1.AddressType.HOME }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.AddressType),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rahim Uddin' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "recipientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01712345678' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^01[3-9]\d{8}$/, {
        message: 'Phone must be a valid Bangladesh mobile number (e.g. 01712345678)',
    }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01812345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^01[3-9]\d{8}$/, {
        message: 'Alternate phone must be a valid Bangladesh mobile number',
    }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhaka' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhaka' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhanmondi' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "upazilaThana", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1205' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhanmondi 27' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Road 5, Dhanmondi R/A' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "addressLine", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Flat 3B, House 12' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "houseFlat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Near Star Kabab' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "landmark", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ring the bell twice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "deliveryNote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "isDefault", void 0);
//# sourceMappingURL=create-address.dto.js.map