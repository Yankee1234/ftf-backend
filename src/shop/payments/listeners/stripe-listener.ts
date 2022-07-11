import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PinoLogger } from "nestjs-pino";
import { StripeCustomerCreateEvent } from "../events/stripe-customer-create-event";

@Injectable()
export class StripeListener {
    constructor(
        private readonly log: PinoLogger
    ) {}

    @OnEvent(StripeCustomerCreateEvent.NAME)
    async handleStripeCustomerCreateEvent(evt: StripeCustomerCreateEvent) {
       this.log.info(`Hangle event ${StripeCustomerCreateEvent.NAME}`);
    }
}