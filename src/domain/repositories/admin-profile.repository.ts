import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminProfile } from '../entities/admin-profile.entity';

@Injectable()
export class AdminProfileRepository {
  constructor(
    @InjectRepository(AdminProfile)
    private readonly repo: Repository<AdminProfile>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(entity: AdminProfile) {
    await this.repo.save(entity);
  }

  async getByIdWithUser(userId: number) {
    return await this.repo
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.user', 'user')
      .where('a.userId = :userId', { userId })
      .getOne();
  }
}
