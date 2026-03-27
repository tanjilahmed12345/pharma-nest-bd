import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';
import { SearchModule } from './modules/search/search.module';
import { CartsModule } from './modules/carts/carts.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    SearchModule,
    CartsModule,
    WishlistsModule,
    CheckoutModule,
  ],
})
export class AppModule {}
