import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

interface ProductsResult {
  total: number;
  products: Product[];
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(entity: Product) {
    await this.repo.save(entity);
  }

  async getByProductName(name: string) {
    return await this.repo
      .createQueryBuilder('p')
      .where('p.name = :name', { name })
      .getOne();
  }

  async getAllProducts(): Promise<ProductsResult> {
    const qb = this.repo.createQueryBuilder('p');
    return {
      total: await qb.getCount(),
      products: await qb.getMany(),
    };
  }

  async getProductById(id) {
    return await this.repo
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOne();
  }
}
