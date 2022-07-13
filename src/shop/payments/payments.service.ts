import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Money from 'bigint-money';
import { PinoLogger } from 'nestjs-pino';
import { AuthIdentity } from 'src/auth/jwt.strategy';
import {
  OrderStatus,
  ProductOrder,
} from 'src/domain/entities/product-order.entity';
import { PMType } from 'src/domain/entities/stripe-payment-method.entity';
import {
  Payment,
  PaymentStatus,
} from 'src/domain/entities/stripe-payment.entity';
import { ProductOrderRepository } from 'src/domain/repositories/product-order.repository';
import { StripeCustomerRepository } from 'src/domain/repositories/stripe-customer.repository';
import { StripePaymentMethodRepository } from 'src/domain/repositories/stripe-payment-method.repository';
import { PaymentRepository } from 'src/domain/repositories/stripe-payment.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { toUserProfileDto } from 'src/user/serializers';
import Stripe from 'stripe';
import { EntityNotFoundError } from 'typeorm';
import {
  runOnTransactionCommit,
  Transactional,
} from 'typeorm-transactional-cls-hooked';
import { BuyProductRequest } from '../dtos/buy-product-request.dto';
import { AttachPaymentMethodRequest } from './dtos/attach-payment-method-request.dto';
import { CreateStripeProductRequest } from './dtos/create-product-request.dto';
import { PaymentMethodAttachedEvent } from './events/payment-method-attached-event';
import { PaymentSucceededEvent } from './events/payment-succeeded-event';
import { formatStripeCurrency } from './helpers/stripe-helper';
import { Payment as PaymentDto } from './dtos/payment.dto';
import { PaymentMethod } from './dtos/payment-methods.dto';

interface ICreatedProductData {
  productId: string;
  priceId: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly config: ConfigService,
    private readonly stripeCustomerRepo: StripeCustomerRepository,
    private readonly userProfilesRepo: UserProfileRepository,
    private readonly log: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly paymentMethodRepo: StripePaymentMethodRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly ordersRepo: ProductOrderRepository,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY', ''), {
      timeout: 30000,
      apiVersion: '2020-08-27',
    });
  }

  async getOrCreateCustomer(userId: number) {
    try {
      const customer = await this.stripeCustomerRepo.getById(userId);
      return customer.stripeCustomerId;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        await this.createStripeCustomer(userId);
      }
      throw err;
    }
  }

  async createStripeCustomer(userId: number) {
    try {
      const profile = await this.userProfilesRepo.getUserProfileById(userId);
      const { user } = profile;

      const stripeCustomer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.login} ${user.email}`,
        metadata: {
          userId: user.id,
        },
        phone: profile.phoneNumber ?? '',
      });

      const localStripeCustomer = this.stripeCustomerRepo.create(
        stripeCustomer.id,
        user.id,
      );

      await this.stripeCustomerRepo.save(localStripeCustomer);

      return localStripeCustomer.stripeCustomerId;
    } catch (err) {
      this.log.error('Failed to create stripe customer');
    }
  }

  @Transactional()
  async attachPaymentMethod(
    req: AttachPaymentMethodRequest,
    identity: AuthIdentity,
  ) {
    try {
      const stripeCustomerId = await this.getOrCreateCustomer(identity.id);

      const attachedPaymentMethod = await this.stripe.paymentMethods.attach(
        await this.createPaymentMethod(req, identity),
        {
          customer: stripeCustomerId,
        },
      );

      const localPaymentMethod = await this.paymentMethodRepo.create();
      localPaymentMethod.pmType = PMType.Card;
      localPaymentMethod.paymentMethodId = attachedPaymentMethod.id;
      localPaymentMethod.userId = identity.id;
      localPaymentMethod.lastNumbers = req.number.slice(req.number.length - 4);

      await this.paymentMethodRepo.save(localPaymentMethod);

      runOnTransactionCommit(() => {
        this.log.trace('Attaching payment method');

        this.eventEmitter.emit(
          PaymentMethodAttachedEvent.NAME,
          new PaymentMethodAttachedEvent(attachedPaymentMethod.id, identity),
        );
      });
    } catch (err) {
      this.log.error('Failed creating and attaching payment method', { err });
    }
  }

  async createPaymentMethod(
    req: AttachPaymentMethodRequest,
    identity: AuthIdentity,
  ) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: req.number,
        exp_month: req.expireMonth,
        exp_year: req.expireYear,
        cvc: req.cvc,
      },
      metadata: {
        userId: identity.id,
      },
    });

    return paymentMethod.id;
  }

  async createProduct(
    req: CreateStripeProductRequest,
  ): Promise<ICreatedProductData> {
    try {
      const product = await this.stripe.products.create({
        name: req.name,
        metadata: {
          productId: req.productId,
        },
        default_price_data: {
          currency: req.money.currency,
          unit_amount: formatStripeCurrency(req.money),
        },
      });

      return {
        productId: product.id,
        priceId:
          typeof product.default_price === 'string'
            ? product.default_price
            : product.default_price.id,
      };
    } catch (err) {
      this.log.error('Error with creating product', { err });
    }
  }

  @Transactional()
  async createPaymentForOrder(
    req: BuyProductRequest,
    order: ProductOrder,
    identity: AuthIdentity,
  ) {
    const localPayment = this.paymentRepo.create();
    localPayment.stripePaymentId = '';
    localPayment.orderId = order.id;
    localPayment.userId = req.userId;

    try {
      const paymentMethod = await this.paymentMethodRepo.getById(
        req.paymentMethodId,
      );

      const customer = await this.stripeCustomerRepo.getById(identity.id);

      const payment = await this.stripe.paymentIntents.create({
        payment_method: paymentMethod.paymentMethodId,
        amount: formatStripeCurrency(
          new Money(order.totalAmount, order.totalCurrency),
        ),
        currency: order.totalCurrency,
        confirm: true,
        metadata: {
          userId: req.userId,
          orderId: order.id,
        },
        customer: customer.stripeCustomerId,
      });

      localPayment.stripePaymentId = payment.id;
      localPayment.chargeAmount = order.totalAmount;
      localPayment.chargeCurrency = order.totalCurrency;

      console.log('payment');

      if (payment.status === 'succeeded') {
        localPayment.status = PaymentStatus.Succeeded;
        order.status = OrderStatus.Paid;
        const invoice = payment.invoice;
        if (invoice && typeof invoice !== 'string') {
          localPayment.receiptUrl = invoice.invoice_pdf;
        }

        await this.ordersRepo.save(order);
        await this.paymentRepo.save(localPayment);

        runOnTransactionCommit(() => {
          this.log.trace('Payment is succeeded');

          this.eventEmitter.emit(
            PaymentSucceededEvent.NAME,
            new PaymentSucceededEvent(payment.id, identity),
          );
        });
      }

      await this.paymentRepo.save(localPayment);
    } catch (err) {
      this.log.error('Error while processing payment', { err });

      throw err;
    }
  }

  async getAllUserPayments(userId: number) {
    const payments = await this.paymentRepo.getByUserId(userId);

    return payments.map((p) => PaymentsService.toPaymentDto(p));
  }

  private static toPaymentDto(payment: Payment) {
    const dto = new PaymentDto();
    dto.id = payment.id;
    dto.status = payment.status;
    dto.amount = payment.chargeAmount;
    dto.currency = payment.chargeCurrency;
    dto.receiptUrl = payment.receiptUrl;

    return dto;
  }

  async cancelPaymentForOrder(paymentId: string, identity: AuthIdentity) {}

  async getPaymentMethods(userId: number) {
    const paymentMethods = await this.paymentMethodRepo.getByUserId(userId);

    return paymentMethods.map((pm) => {
      const dto = new PaymentMethod();
      dto.paymentMethodId = pm.paymentMethodId;
      dto.lastNumbers = pm.lastNumbers;

      return dto;
    });
  }
}
