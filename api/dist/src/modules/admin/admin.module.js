"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_dashboard_controller_1 = require("./admin-dashboard.controller");
const admin_dashboard_service_1 = require("./admin-dashboard.service");
const admin_customers_controller_1 = require("./admin-customers.controller");
const admin_customers_service_1 = require("./admin-customers.service");
const admin_settings_controller_1 = require("./admin-settings.controller");
const admin_settings_service_1 = require("./admin-settings.service");
const admin_products_controller_1 = require("./admin-products.controller");
const admin_categories_controller_1 = require("./admin-categories.controller");
const admin_brands_controller_1 = require("./admin-brands.controller");
const admin_orders_controller_1 = require("./admin-orders.controller");
const admin_prescriptions_controller_1 = require("./admin-prescriptions.controller");
const admin_payments_controller_1 = require("./admin-payments.controller");
const products_module_1 = require("../products/products.module");
const categories_module_1 = require("../categories/categories.module");
const brands_module_1 = require("../brands/brands.module");
const orders_module_1 = require("../orders/orders.module");
const prescriptions_module_1 = require("../prescriptions/prescriptions.module");
const payments_module_1 = require("../payments/payments.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            brands_module_1.BrandsModule,
            orders_module_1.OrdersModule,
            prescriptions_module_1.PrescriptionsModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [
            admin_dashboard_controller_1.AdminDashboardController,
            admin_customers_controller_1.AdminCustomersController,
            admin_settings_controller_1.AdminSettingsController,
            admin_products_controller_1.AdminProductsController,
            admin_categories_controller_1.AdminCategoriesController,
            admin_brands_controller_1.AdminBrandsController,
            admin_orders_controller_1.AdminOrdersController,
            admin_prescriptions_controller_1.AdminPrescriptionsController,
            admin_payments_controller_1.AdminPaymentsController,
        ],
        providers: [
            admin_dashboard_service_1.AdminDashboardService,
            admin_customers_service_1.AdminCustomersService,
            admin_settings_service_1.AdminSettingsService,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map