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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const checkout_service_1 = require("./checkout.service");
const checkout_preview_dto_1 = require("./dto/checkout-preview.dto");
const place_order_dto_1 = require("./dto/place-order.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CheckoutController = class CheckoutController {
    checkoutService;
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    async preview(user, dto) {
        return this.checkoutService.preview(user.sub, dto);
    }
    async placeOrder(user, dto) {
        return this.checkoutService.placeOrder(user.sub, dto);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Preview checkout with delivery fee and totals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checkout preview' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cart empty or validation error' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_preview_dto_1.CheckoutPreviewDto]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('place-order'),
    (0, swagger_1.ApiOperation)({ summary: 'Place order from current cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order placed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation or stock error' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, place_order_dto_1.PlaceOrderDto]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "placeOrder", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Checkout'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('checkout'),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map