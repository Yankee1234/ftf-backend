import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../entities/stripe-payment-method.entity';

@Injectable()
export class StripePaymentMethodRepository {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly repo: Repository<PaymentMethod>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(entity: PaymentMethod) {
    await this.repo.save(entity);
  }

  async getById(id: string) {
    return await this.repo
      .createQueryBuilder('pm')
      .where('pm.paymentMethodId = :id', { id })
      .getOneOrFail();
  }

  async getByUserId(userId: number) {
    
    return await this.repo.createQueryBuilder('pm')
    .where('pm.userId = :userId', { userId })
    .getMany();
  } 
}
