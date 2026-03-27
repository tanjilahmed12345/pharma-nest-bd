import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum VerifyStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class VerifyPaymentDto {
  @ApiProperty({ enum: VerifyStatus })
  @IsNotEmpty()
  @IsEnum(VerifyStatus)
  status: VerifyStatus;

  @ApiPropertyOptional({ example: 'Transaction confirmed' })
  @IsOptional()
  @IsString()
  verificationNote?: string;
}
