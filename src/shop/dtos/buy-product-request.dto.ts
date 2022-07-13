import { ApiProperty } from "@nestjs/swagger";

export class BuyProductRequest {
  @ApiProperty()
  productId!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  paymentMethodId!: string;
}
