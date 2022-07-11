import { ApiProperty } from "@nestjs/swagger";

export class ProductItem {
    @ApiProperty()
    name!: string;

    @ApiProperty({ example: '1.00'})
    amount!: string;

    @ApiProperty({ example: 'USD'})
    currency!: string;
}