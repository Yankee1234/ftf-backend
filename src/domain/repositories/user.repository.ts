import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(user: User) {
    await this.repo.save(user);
  }

  async getByLogin(login: string, email?: string) {
    const query = this.repo
      .createQueryBuilder('u')
      .where('u.login = :login', { login });

    if (email) query.andWhere('u.email = :email', { email });

    return await query.getOne();
  }

  async getById(id: number) {
    return await this.repo
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .getOne();
  }
}
