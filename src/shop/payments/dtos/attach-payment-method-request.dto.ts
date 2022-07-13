import { ApiProperty } from "@nestjs/swagger";

export class AttachPaymentMethodRequest {
  @ApiProperty({ example: '4242424242424242'})
  number!: string;

  @ApiProperty({ example: 2023})
  expireYear!: number;

  @ApiProperty({ example: 1})
  expireMonth!: number;

  @ApiProperty({ example: '123'})
  cvc!: string;
}
