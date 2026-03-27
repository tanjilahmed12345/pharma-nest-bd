import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../../common/constants';
import { DosageForm } from '../../../common/enums';

export enum ProductSort {
  LATEST = 'latest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
}

export class ProductQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: DEFAULT_PAGE_SIZE })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit?: number = DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({ description: 'Text search' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  prescriptionRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ enum: DosageForm })
  @IsOptional()
  @IsEnum(DosageForm)
  dosageForm?: DosageForm;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional({ enum: ProductSort, default: ProductSort.LATEST })
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort = ProductSort.LATEST;
}
