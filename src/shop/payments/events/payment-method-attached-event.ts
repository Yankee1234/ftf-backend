import { AuthIdentity } from "src/auth/jwt.strategy";

export class PaymentMethodAttachedEvent {
    static readonly NAME = 'payment-method-attached-event';

    constructor(public readonly paymentMethodId: string, public readonly identity: AuthIdentity) {}
}