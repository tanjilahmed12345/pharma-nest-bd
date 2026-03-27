import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../../common/enums';
import { PaymentInputDto } from './payment-input.dto';

export class PlaceOrderDto {
  @ApiProperty({ example: 'clxyz123' })
  @IsNotEmpty()
  @IsString()
  addressId: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prescriptionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerNote?: string;

  @ApiPropertyOptional({ type: PaymentInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentInputDto)
  paymentInput?: PaymentInputDto;
}
