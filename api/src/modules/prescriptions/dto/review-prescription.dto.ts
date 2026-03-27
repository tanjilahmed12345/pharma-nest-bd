import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReviewStatus {
  APPROVED = 'APPROVED',
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_CLARIFICATION = 'NEEDS_CLARIFICATION',
}

export class ReviewPrescriptionDto {
  @ApiProperty({ enum: ReviewStatus })
  @IsNotEmpty()
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @ApiPropertyOptional({ example: 'Approved for all items' })
  @IsOptional()
  @IsString()
  pharmacistNote?: string;
}
