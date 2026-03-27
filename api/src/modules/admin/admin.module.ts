import { Module } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminCustomersController } from './admin-customers.controller';
import { AdminCustomersService } from './admin-customers.service';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminSettingsService } from './admin-settings.service';
import { AdminProductsController } from './admin-products.controller';
import { AdminCategoriesController } from './admin-categories.controller';
import { AdminBrandsController } from './admin-brands.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminPrescriptionsController } from './admin-prescriptions.controller';
import { AdminPaymentsController } from './admin-payments.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { OrdersModule } from '../orders/orders.module';
import { PrescriptionsModule } from '../prescriptions/prescriptions.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    OrdersModule,
    PrescriptionsModule,
    PaymentsModule,
  ],
  controllers: [
    AdminDashboardController,
    AdminCustomersController,
    AdminSettingsController,
    AdminProductsController,
    AdminCategoriesController,
    AdminBrandsController,
    AdminOrdersController,
    AdminPrescriptionsController,
    AdminPaymentsController,
  ],
  providers: [
    AdminDashboardService,
    AdminCustomersService,
    AdminSettingsService,
  ],
})
export class AdminModule {}
