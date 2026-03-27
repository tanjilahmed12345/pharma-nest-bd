import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class PaymentInputDto {
  @ApiPropertyOptional({ example: '01712345678' })
  @IsOptional()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Sender number must be a valid Bangladesh mobile number',
  })
  senderNumber?: string;

  @ApiPropertyOptional({ example: 'TXN123456789' })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ example: 500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  paymentTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  screenshotUrl?: string;
}
