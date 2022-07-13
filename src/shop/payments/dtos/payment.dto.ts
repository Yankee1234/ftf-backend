import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal } from "class-validator";
import { PaymentStatus } from "src/domain/entities/stripe-payment.entity";

export class Payment {
    @ApiProperty({ enum: PaymentStatus })
    status!: PaymentStatus;

    @ApiProperty()
    id!: number;

    @ApiProperty({ maxLength: 3, minLength: 3 })
    currency!: string;

    @ApiProperty({ example: '1.00' })
    @IsDecimal()
    amount!: string;

    @ApiProperty()
    receiptUrl!: string;
}