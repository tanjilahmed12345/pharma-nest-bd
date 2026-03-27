import {
  Controller,
  Get,
  Post,
  Patch,
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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  // ── Public ──

  @Get()
  @ApiOperation({ summary: 'List active brands' })
  async findAll() {
    return this.brandsService.getActiveBrands();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get brand by slug' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.brandsService.getBrandBySlug(slug);
  }

  // ── Admin ──

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create brand (admin)' })
  @ApiResponse({ status: 201, description: 'Brand created' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() dto: CreateBrandDto) {
    return this.brandsService.createBrand(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update brand (admin)' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.updateBrand(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete brand (admin)' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 400, description: 'Has products' })
  async remove(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
