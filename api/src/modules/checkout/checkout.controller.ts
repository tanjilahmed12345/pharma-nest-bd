import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CheckoutPreviewDto } from './dto/checkout-preview.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Checkout')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Preview checkout with delivery fee and totals' })
  @ApiResponse({ status: 200, description: 'Checkout preview' })
  @ApiResponse({ status: 400, description: 'Cart empty or validation error' })
  async preview(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CheckoutPreviewDto,
  ) {
    return this.checkoutService.preview(user.sub, dto);
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Place order from current cart' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 400, description: 'Validation or stock error' })
  async placeOrder(
    @CurrentUser() user: JwtPayload,
    @Body() dto: PlaceOrderDto,
  ) {
    return this.checkoutService.placeOrder(user.sub, dto);
  }
}
