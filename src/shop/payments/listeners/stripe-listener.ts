import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PinoLogger } from "nestjs-pino";
import { PaymentMethodAttachedEvent } from "../events/payment-method-attached-event";
import { StripeCustomerCreateEvent } from "../events/stripe-customer-create-event";

@Injectable()
export class StripeListener {
    constructor(
        private readonly log: PinoLogger
    ) {}

    @OnEvent(StripeCustomerCreateEvent.NAME)
    async handleStripeCustomerCreateEvent(evt: StripeCustomerCreateEvent) {
       this.log.info(`Handle event ${StripeCustomerCreateEvent.NAME}`);
    }

    @OnEvent(PaymentMethodAttachedEvent.NAME)
    async handlePaymentMethodAttachedEvent(evt: PaymentMethodAttachedEvent) {
        this.log.info(`Handle event ${PaymentMethodAttachedEvent.NAME}`);

        
    }
}