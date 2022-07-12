import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';
import { OrderStatus } from 'src/domain/entities/product-order.entity';
import { PaymentStatus } from 'src/domain/entities/stripe-payment.entity';
import { ProductOrderRepository } from 'src/domain/repositories/product-order.repository';
import { PaymentRepository } from 'src/domain/repositories/stripe-payment.repository';
import { NotificationService } from 'src/notification/notification.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentSchedulingService {
  private stripe: Stripe;
  constructor(
    private readonly ordersRepo: ProductOrderRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly config: ConfigService,
    private readonly log: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY', ''), {
      timeout: 30000,
      apiVersion: '2020-08-27',
    });
  }

  @Cron('* * * * *')
  async handlePendingPayments() {
    try {
      const payments = await this.paymentRepo.getPendingWithOrder();

      for (let i = 0; i < payments.length; i += 1) {
        const payment = payments[i];
        const stripePayment = await this.stripe.paymentIntents.retrieve(
          payment.stripePaymentId,
        );

        if (stripePayment.status === 'succeeded') {
          const order = payment.order;
          payment.status = PaymentStatus.Succeeded;
          order.status = OrderStatus.Paid;

          await this.ordersRepo.save(order);
          await this.paymentRepo.save(payment);

          await this.notificationService.createNotification({
            message: 'Payment has been succeeded',
            userId: payment.user.id,
          });
        }
      }
    } catch (err) {
      this.log.error('Error while handling pending payments', { err });
    }
  }
}
