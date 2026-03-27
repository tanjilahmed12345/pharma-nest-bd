import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DosageForm, ProductStatus } from '../../../common/enums';

export class ProductImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Napa Extra' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'napa-extra' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Paracetamol + Caffeine' })
  @IsNotEmpty()
  @IsString()
  genericName: string;

  @ApiProperty({ example: 'clxyz123' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'clxyz456' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiProperty({ example: 'Beximco Pharmaceuticals' })
  @IsNotEmpty()
  @IsString()
  manufacturerName: string;

  @ApiPropertyOptional({ enum: DosageForm, default: DosageForm.TABLET })
  @IsOptional()
  @IsEnum(DosageForm)
  dosageForm?: DosageForm;

  @ApiProperty({ example: '500mg + 65mg' })
  @IsNotEmpty()
  @IsString()
  strength: string;

  @ApiProperty({ example: '10 tablets/strip' })
  @IsNotEmpty()
  @IsString()
  packSize: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  indications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dosageInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sideEffects?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warnings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageInfo?: string;

  @ApiProperty({ example: 25.0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 20.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiPropertyOptional({ example: 15.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockQty?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  minOrderQty?: number;

  @ApiPropertyOptional({ default: 99 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxOrderQty?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrescriptionRequired?: boolean;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [String], example: ['pain', 'fever'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
