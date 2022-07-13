import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { UsersGames } from 'src/domain/entities/users-games.entity';
import { UsersGamesRepository } from 'src/domain/repositories/users-games.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserProfile, UsersGames]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserProfileRepository,
    UsersGamesRepository,
  ],
})
export class UserModule {}
