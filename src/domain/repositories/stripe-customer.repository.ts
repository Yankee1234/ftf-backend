import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { StripeCustomer } from '../entities/stripe-customer.entity';

@Injectable()
export class StripeCustomerRepository {
  constructor(
    @InjectRepository(StripeCustomer)
    private readonly repo: Repository<StripeCustomer>,
  ) {}

  create(stripeCustomerId: string, userId: number) {
    return this.repo.create({ stripeCustomerId, userId });
  }

  async save(customer: StripeCustomer) {
    await this.repo.save(customer);
  }

  async getById(id: number | string) {
    const qb = this.repo.createQueryBuilder('sc');

    if (typeof id === 'string') qb.where('sc.stripeCustomerId = :id');
    else if (typeof id === 'number') qb.where('sc.userId = :id');
    qb.setParameter('id', id);

    return await qb.getOneOrFail();
  }
}
