import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PinoLogger } from "nestjs-pino";
import { AuthIdentity } from "src/auth/jwt.strategy";
import { PMType } from "src/domain/entities/stripe-payment-method.entity";
import { StripeCustomerRepository } from "src/domain/repositories/stripe-customer.repository";
import { StripePaymentMethodRepository } from "src/domain/repositories/stripe-payment-method.repository";
import { UserProfileRepository } from "src/domain/repositories/user-profile.repository";
import { UserRepository } from "src/domain/repositories/user.repository";
import Stripe from 'stripe';
import { EntityNotFoundError } from "typeorm";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional-cls-hooked";
import { AttachPaymentMethodRequest } from "./dtos/attach-payment-method-request.dto";
import { PaymentMethodAttachedEvent } from "./events/payment-method-attached-event";
import { StripeCustomerCreateEvent } from "./events/stripe-customer-create-event";

@Injectable()
export class PaymentsService {

    private stripe: Stripe;

    constructor(private readonly config: ConfigService,
        private readonly stripeCustomerRepo: StripeCustomerRepository,
        private readonly userProfilesRepo: UserProfileRepository,
        private readonly log: PinoLogger,
        private readonly eventEmitter: EventEmitter2,
        private readonly paymentMethodRepo: StripePaymentMethodRepository
        ) {
        this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY', ''), {
            timeout: 30000,
            apiVersion: '2020-08-27'
        });
    }

    async getOrCreateCustomer(userId: number) {
        try {
            const customer = await this.stripeCustomerRepo.getById(userId);
            return customer.stripeCustomerId;
        } catch(err) {
            if(err instanceof EntityNotFoundError) {
                await this.createStripeCustomer(userId);
            }
            throw err;
        }
    }

    async createStripeCustomer(userId: number) {
        try {
            const profile = await this.userProfilesRepo.getUserProfileById(userId, true);
            const { user } = profile;
            
            const stripeCustomer = await this.stripe.customers.create({
                email: user.email,
                name: `${user.login} ${user.email}`,
                metadata: {
                    userId: user.id,
                },
                phone: profile.phoneNumber ?? ''
            })

            const localStripeCustomer = this.stripeCustomerRepo.create(stripeCustomer.id, user.id);

            await this.stripeCustomerRepo.save(localStripeCustomer);

            return localStripeCustomer.stripeCustomerId;
        } catch(err) {
            this.log.error('Failed to create stripe customer');
        }
    }

    @Transactional()
    async attachPaymentMethod(req: AttachPaymentMethodRequest, identity: AuthIdentity) {
        try {
            const stripeCustomerId = await this.getOrCreateCustomer(identity.id);

            const attachedPaymentMethod = await this.stripe.paymentMethods.attach(
                await this.createPaymentMethod(req, identity),
                {
                    customer: stripeCustomerId
                }
            );

            const localPaymentMethod = await this.paymentMethodRepo.create();
            localPaymentMethod.pmType = PMType.Card;
            localPaymentMethod.paymentMethodId = attachedPaymentMethod.id;
            localPaymentMethod.userId = identity.id;

            await this.paymentMethodRepo.save(localPaymentMethod);

            this.eventEmitter.emit(PaymentMethodAttachedEvent.NAME, new PaymentMethodAttachedEvent(attachedPaymentMethod.id,identity))
        } catch(err) {
            this.log.error('Failed creating and attaching payment method', { err })
        }
    }

    async createPaymentMethod(req: AttachPaymentMethodRequest, identity: AuthIdentity) {
        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: req.number,
                exp_month: req.expireMonth,
                exp_year: req.expireYear,
                cvc: req.cvc
            },
            metadata: {
                userId: identity.id
            }
        });

        return paymentMethod.id;
    }

    
}