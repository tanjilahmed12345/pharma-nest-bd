import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
} from 'class-validator';
import { AddressType } from '../../../common/enums';

export class CreateAddressDto {
  @ApiPropertyOptional({ enum: AddressType, default: AddressType.HOME })
  @IsOptional()
  @IsEnum(AddressType)
  label?: AddressType;

  @ApiProperty({ example: 'Rahim Uddin' })
  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @ApiProperty({ example: '01712345678' })
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladesh mobile number (e.g. 01712345678)',
  })
  phone: string;

  @ApiPropertyOptional({ example: '01812345678' })
  @IsOptional()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Alternate phone must be a valid Bangladesh mobile number',
  })
  alternatePhone?: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsNotEmpty()
  @IsString()
  division: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({ example: 'Dhanmondi' })
  @IsNotEmpty()
  @IsString()
  upazilaThana: string;

  @ApiProperty({ example: '1205' })
  @IsNotEmpty()
  @IsString()
  postcode: string;

  @ApiProperty({ example: 'Dhanmondi 27' })
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty({ example: 'Road 5, Dhanmondi R/A' })
  @IsNotEmpty()
  @IsString()
  addressLine: string;

  @ApiProperty({ example: 'Flat 3B, House 12' })
  @IsNotEmpty()
  @IsString()
  houseFlat: string;

  @ApiPropertyOptional({ example: 'Near Star Kabab' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({ example: 'Ring the bell twice' })
  @IsOptional()
  @IsString()
  deliveryNote?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
