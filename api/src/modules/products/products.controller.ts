import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // ── Public ──

  @Get()
  @ApiOperation({ summary: 'List products with filtering, sorting, and pagination' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.getProducts(query);
  }

  @Get('featured/list')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeatured(
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get('offers/list')
  @ApiOperation({ summary: 'Get products with active discounts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getOffers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getOfferProducts(page, limit);
  }

  @Get('otc/list')
  @ApiOperation({ summary: 'Get OTC (non-prescription) products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getOtc(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getOtcProducts(page, limit);
  }

  @Get('rx/list')
  @ApiOperation({ summary: 'Get prescription-required products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRx(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getRxProducts(page, limit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product detail by slug' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  @Get(':slug/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRelated(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getRelatedProducts(slug, limit);
  }

  // ── Admin ──

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create product (admin)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product (admin)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete product (admin)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Toggle product active/inactive (admin)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleActive(@Param('id') id: string) {
    return this.productsService.toggleActive(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Toggle product featured status (admin)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleFeatured(@Param('id') id: string) {
    return this.productsService.toggleFeatured(id);
  }
}
