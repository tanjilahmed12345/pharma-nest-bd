import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../../../common/enums';

export class SubmitPaymentDto {
  @ApiProperty({ example: 'clxyz123' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ enum: [PaymentMethod.BKASH, PaymentMethod.NAGAD, PaymentMethod.ROCKET] })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: '01712345678' })
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Sender number must be a valid Bangladesh mobile number',
  })
  senderNumber: string;

  @ApiProperty({ example: 'TXN123456789' })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

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
