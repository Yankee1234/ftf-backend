import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal } from 'class-validator';

export class CreateProductRequest {
  @ApiProperty()
  name!: string;

  @ApiProperty({ maxLength: 3, minLength: 3 })
  currency!: string;

  @ApiProperty({ example: '1.00' })
  @IsDecimal()
  amount!: string;
}
