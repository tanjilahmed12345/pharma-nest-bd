import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  async getWishlist(@CurrentUser() user: JwtPayload) {
    return this.wishlistsService.getWishlist(user.sub);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  @ApiResponse({ status: 409, description: 'Product already in wishlist' })
  async addItem(
    @CurrentUser() user: JwtPayload,
    @Body('productId') productId: string,
  ) {
    return this.wishlistsService.addItem(user.sub, productId);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async removeItem(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wishlistsService.removeItem(user.sub, productId);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check if product is in wishlist' })
  async checkItem(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wishlistsService.isInWishlist(user.sub, productId);
  }
}
