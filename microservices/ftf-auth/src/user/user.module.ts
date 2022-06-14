import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
