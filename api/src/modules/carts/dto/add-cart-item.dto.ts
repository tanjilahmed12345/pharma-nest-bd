import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 'clxyz123' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
