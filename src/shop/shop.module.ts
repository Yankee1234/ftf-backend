import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeCustomer } from 'src/domain/entities/stripe-customer.entity';
import { PaymentMethod } from 'src/domain/entities/stripe-payment-method.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { User } from 'src/domain/entities/user.entity';
import { StripeCustomerRepository } from 'src/domain/repositories/stripe-customer.repository';
import { StripePaymentMethodRepository } from 'src/domain/repositories/stripe-payment-method.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([StripeCustomer, UserProfile, User, PaymentMethod])],
  controllers: [ShopController, PaymentsController],
  providers: [PaymentsService, ShopService, StripeCustomerRepository, UserProfileRepository, UserRepository, StripePaymentMethodRepository]
})
export class ShopModule {}
