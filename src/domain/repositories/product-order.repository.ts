import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOrder } from '../entities/product-order.entity';

@Injectable()
export class ProductOrderRepository {
  constructor(
    @InjectRepository(ProductOrder)
    private readonly repo: Repository<ProductOrder>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(entity: ProductOrder) {
    await this.repo.save(entity);
  }

  async getByUserId(userId: number) {
    return await this.repo
      .createQueryBuilder('po')
      .where('po.userId = :userId', { userId })
      .getMany();
  }
}
