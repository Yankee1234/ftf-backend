import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentMethod } from "../entities/stripe-payment-method.entity";

@Injectable()
export class StripePaymentMethodRepository {
    constructor(@InjectRepository(PaymentMethod) private readonly repo: Repository<PaymentMethod>) {}

    create() {
        return this.repo.create();
    }

    async save(entity: PaymentMethod) {
        await this.repo.save(entity);
    }
}