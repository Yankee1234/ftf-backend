import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/stripe-payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment) private readonly repo: Repository<Payment>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(entity: Payment) {
    await this.repo.save(entity);
  }

  async getByUserId(userId: number) {
    return await this.repo
      .createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .getMany();
  }

  async getPendingWithOrder() {
    return await this.repo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.order', 'o')
      .innerJoinAndSelect('p.user', 'u')
      .where('p.status = :status', { status: PaymentStatus.Pending })
      .getMany();
  }
}
