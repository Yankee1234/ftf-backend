import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/domain/entities/notification.entity';
import { ProductOrder } from 'src/domain/entities/product-order.entity';
import { Product } from 'src/domain/entities/product.entity';
import { StripeCustomer } from 'src/domain/entities/stripe-customer.entity';
import { PaymentMethod } from 'src/domain/entities/stripe-payment-method.entity';
import { Payment } from 'src/domain/entities/stripe-payment.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { User } from 'src/domain/entities/user.entity';
import { NotificationRepository } from 'src/domain/repositories/notification.repository';
import { ProductOrderRepository } from 'src/domain/repositories/product-order.repository';
import { ProductRepository } from 'src/domain/repositories/product.repository';
import { StripeCustomerRepository } from 'src/domain/repositories/stripe-customer.repository';
import { StripePaymentMethodRepository } from 'src/domain/repositories/stripe-payment-method.repository';
import { PaymentRepository } from 'src/domain/repositories/stripe-payment.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { NotificationService } from 'src/notification/notification.service';
import { StripeListener } from './payments/listeners/stripe-listener';
import { PaymentSchedulingService } from './payments/payment-scheduling.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      StripeCustomer,
      UserProfile,
      User,
      PaymentMethod,
      Product,
      ProductOrder,
      Payment,
      Notification
    ]),
  ],
  controllers: [ShopController, PaymentsController],
  providers: [
    PaymentsService,
    ShopService,
    StripeCustomerRepository,
    UserProfileRepository,
    UserRepository,
    StripePaymentMethodRepository,
    ProductRepository,
    ProductOrderRepository,
    PaymentRepository,
    PaymentSchedulingService,
    NotificationService,
    NotificationRepository,
    StripeListener
  ],
})
export class ShopModule {}
