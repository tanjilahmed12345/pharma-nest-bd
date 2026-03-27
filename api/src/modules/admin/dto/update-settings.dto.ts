import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'PharmaNest BD' })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiPropertyOptional({ example: '01700000000' })
  @IsOptional()
  @IsString()
  supportPhone?: string;

  @ApiPropertyOptional({ example: 'support@pharmanest.com' })
  @IsOptional()
  @IsString()
  supportEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storeAddress?: string;

  @ApiPropertyOptional({ example: '01700000001' })
  @IsOptional()
  @IsString()
  bkashNumber?: string;

  @ApiPropertyOptional({ example: '01700000002' })
  @IsOptional()
  @IsString()
  nagadNumber?: string;

  @ApiPropertyOptional({ example: '01700000003' })
  @IsOptional()
  @IsString()
  rocketNumber?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  codEnabled?: boolean;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseDeliveryCharge?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dhakaDeliveryCharge?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  outsideDhakaCharge?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  freeDeliveryThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prescriptionPolicyText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  footerText?: string;
}
