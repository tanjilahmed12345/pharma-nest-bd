import { DocumentBuilder } from '@nestjs/swagger';

export function buildSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('PharmaNest BD API')
    .setDescription('Backend API for the Bangladesh pharmacy e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Products', 'Product catalog')
    .addTag('Categories', 'Product categories')
    .addTag('Cart', 'Shopping cart')
    .addTag('Checkout', 'Order placement')
    .addTag('Orders', 'Order management')
    .addTag('Prescriptions', 'Prescription management')
    .addTag('Payments', 'Payment submissions')
    .addTag('Addresses', 'User addresses')
    .addTag('Wishlist', 'User wishlist')
    .addTag('Admin', 'Admin operations')
    .addTag('Settings', 'Store settings')
    .build();
}
