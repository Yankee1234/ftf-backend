import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { JwtToken } from '../entities/token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(JwtToken) private readonly repo: Repository<JwtToken>,
  ) {}

  create() {
    return this.repo.create();
  }

  async save(token: JwtToken) {
    await this.repo.save(token);
  }

  async findByTokenString(str: string) {
    return await this.repo
      .createQueryBuilder('t')
      .where('t.token = :str', { str })
      .getOne();
  }
}
