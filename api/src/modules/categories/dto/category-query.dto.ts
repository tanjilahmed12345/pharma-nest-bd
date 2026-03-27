import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CategoryQueryDto {
  @ApiPropertyOptional({ description: 'Include only root categories (no parent)' })
  @IsOptional()
  @IsBoolean()
  rootOnly?: boolean;

  @ApiPropertyOptional({ description: 'Include product counts' })
  @IsOptional()
  @IsBoolean()
  withCount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;
}
