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
exports.ReviewPrescriptionDto = exports.ReviewStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["APPROVED"] = "APPROVED";
    ReviewStatus["PARTIALLY_APPROVED"] = "PARTIALLY_APPROVED";
    ReviewStatus["REJECTED"] = "REJECTED";
    ReviewStatus["NEEDS_CLARIFICATION"] = "NEEDS_CLARIFICATION";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
class ReviewPrescriptionDto {
    status;
    pharmacistNote;
}
exports.ReviewPrescriptionDto = ReviewPrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReviewStatus }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(ReviewStatus),
    __metadata("design:type", String)
], ReviewPrescriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved for all items' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReviewPrescriptionDto.prototype, "pharmacistNote", void 0);
//# sourceMappingURL=review-prescription.dto.js.map