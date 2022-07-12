import { AuthIdentity } from 'src/auth/jwt.strategy';

export class PaymentSucceededEvent {
  static readonly NAME = 'payment-succeeded-event';

  constructor(
    public readonly paymentIntentId: string,
    public readonly identity: AuthIdentity,
  ) {}
}
