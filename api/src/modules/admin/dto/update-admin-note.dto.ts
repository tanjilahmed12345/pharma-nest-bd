import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminNoteDto {
  @ApiPropertyOptional({ example: 'Customer requested express delivery' })
  @IsOptional()
  @IsString()
  adminNote?: string;
}
