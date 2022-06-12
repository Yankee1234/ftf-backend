import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'utils/typeorm/BaseRepository';
import { JwtToken } from '../entities/token.entity';

@Injectable()
@EntityRepository(JwtToken)
export class TokenRepository extends BaseRepository<JwtToken> {
  create() {
    return this.repository.create();
  }

  async save(token: JwtToken) {
    await this.repository.save(token);
  }

  async findByTokenString(str: string) {
    return await this.createQueryBuilder('t')
      .where('t.token = :str', { str })
      .getOne();
  }
}
