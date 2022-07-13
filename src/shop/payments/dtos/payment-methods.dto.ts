import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethod {
  @ApiProperty({ example: 'pm_1q2w3e4r5t6y7u8i9o0p' })
  paymentMethodId!: string;

  @ApiProperty({ example: '4242' })
  lastNumbers!: string;
}
