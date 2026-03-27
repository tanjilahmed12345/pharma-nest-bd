import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Square Pharmaceuticals' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'square-pharmaceuticals' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Square Pharmaceuticals Ltd.' })
  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
