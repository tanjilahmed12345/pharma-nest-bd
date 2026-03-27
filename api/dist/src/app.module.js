"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const addresses_module_1 = require("./modules/addresses/addresses.module");
const categories_module_1 = require("./modules/categories/categories.module");
const brands_module_1 = require("./modules/brands/brands.module");
const products_module_1 = require("./modules/products/products.module");
const search_module_1 = require("./modules/search/search.module");
const carts_module_1 = require("./modules/carts/carts.module");
const wishlists_module_1 = require("./modules/wishlists/wishlists.module");
const checkout_module_1 = require("./modules/checkout/checkout.module");
const orders_module_1 = require("./modules/orders/orders.module");
const prescriptions_module_1 = require("./modules/prescriptions/prescriptions.module");
const payments_module_1 = require("./modules/payments/payments.module");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const auth_config_1 = __importDefault(require("./config/auth.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, database_config_1.default, auth_config_1.default],
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            addresses_module_1.AddressesModule,
            categories_module_1.CategoriesModule,
            brands_module_1.BrandsModule,
            products_module_1.ProductsModule,
            search_module_1.SearchModule,
            carts_module_1.CartsModule,
            wishlists_module_1.WishlistsModule,
            checkout_module_1.CheckoutModule,
            orders_module_1.OrdersModule,
            prescriptions_module_1.PrescriptionsModule,
            payments_module_1.PaymentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map