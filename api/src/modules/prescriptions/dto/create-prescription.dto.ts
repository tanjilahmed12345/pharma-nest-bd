import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'Rahim Uddin' })
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @ApiProperty({ example: 'Dr. Karim' })
  @IsNotEmpty()
  @IsString()
  doctorName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  issuedDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Link to an existing order' })
  @IsOptional()
  @IsString()
  orderId?: string;
}
