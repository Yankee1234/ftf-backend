import { AuthIdentity } from 'src/auth/jwt.strategy';

export class StripeCustomerCreateEvent {
  static readonly NAME = 'stripe-customer-create-event';

  constructor(
    public readonly stripeCustomerId: string,
    public readonly identity: AuthIdentity,
  ) {}
}
