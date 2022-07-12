import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { NotificationService } from 'src/notification/notification.service';
import { OneToMany } from 'typeorm';
import { PaymentMethodAttachedEvent } from '../events/payment-method-attached-event';
import { PaymentSucceededEvent } from '../events/payment-succeeded-event';
import { StripeCustomerCreateEvent } from '../events/stripe-customer-create-event';

@Injectable()
export class StripeListener {
  constructor(
    private readonly log: PinoLogger,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(StripeCustomerCreateEvent.NAME)
  async handleStripeCustomerCreateEvent(evt: StripeCustomerCreateEvent) {
    this.log.info(`Handle event ${StripeCustomerCreateEvent.NAME}`);
  }

  @OnEvent(PaymentMethodAttachedEvent.NAME)
  async handlePaymentMethodAttachedEvent(evt: PaymentMethodAttachedEvent) {
    this.log.info(`Handle event ${PaymentMethodAttachedEvent.NAME}`);

    await this.notificationService.createNotification({
      message: 'Payment method has been attached successfully',
      userId: evt.identity.id,
    });
  }

  @OnEvent(PaymentSucceededEvent.NAME)
  async handlePaymentSucceededEvent(evt: PaymentSucceededEvent) {
    this.log.info(`Handle event ${PaymentSucceededEvent.NAME}`);

    await this.notificationService.createNotification({
      message: 'Payment for order has been succeeded',
      userId: evt.identity.id,
    });
  }
}
