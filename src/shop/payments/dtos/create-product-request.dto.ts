import Money from 'bigint-money';

export class CreateStripeProductRequest {
  constructor(
    readonly name: string,
    readonly money: Money,
    readonly productId: number,
  ) {}
}
