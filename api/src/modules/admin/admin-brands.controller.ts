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
import { BrandsService } from '../brands/brands.service';
import { CreateBrandDto } from '../brands/dto/create-brand.dto';
import { UpdateBrandDto } from '../brands/dto/update-brand.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List all brands with product count (admin)' })
  async findAll() {
    return this.brandsService.adminListBrands();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand detail (admin)' })
  async findOne(@Param('id') id: string) {
    return this.brandsService.adminListBrands().then((brands) => {
      const brand = brands.find((b: any) => b.id === id);
      if (!brand) throw new Error('Brand not found');
      return brand;
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create brand (admin)' })
  @ApiResponse({ status: 201, description: 'Brand created' })
  async create(@Body() dto: CreateBrandDto) {
    return this.brandsService.createBrand(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update brand (admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.updateBrand(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand (admin)' })
  async remove(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
