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
exports.VerifyPaymentDto = exports.VerifyStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var VerifyStatus;
(function (VerifyStatus) {
    VerifyStatus["VERIFIED"] = "VERIFIED";
    VerifyStatus["REJECTED"] = "REJECTED";
})(VerifyStatus || (exports.VerifyStatus = VerifyStatus = {}));
class VerifyPaymentDto {
    status;
    verificationNote;
}
exports.VerifyPaymentDto = VerifyPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: VerifyStatus }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(VerifyStatus),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Transaction confirmed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "verificationNote", void 0);
//# sourceMappingURL=verify-payment.dto.js.map