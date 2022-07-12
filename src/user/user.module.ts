import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserProfile]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserProfileRepository],
})
export class UserModule {}
