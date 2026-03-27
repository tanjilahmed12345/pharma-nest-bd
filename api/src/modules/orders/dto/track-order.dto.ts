import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class TrackOrderDto {
  @ApiProperty({ example: 'PN-12345678-ABC' })
  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @ApiProperty({ example: '01712345678' })
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladesh mobile number',
  })
  phone: string;
}
