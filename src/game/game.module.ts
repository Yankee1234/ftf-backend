import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from 'src/domain/repositories/game.repository';
import { Game } from 'src/domain/entities/game.entity';
import { UsersGames } from 'src/domain/entities/users-games.entity';
import { UsersGamesRepository } from 'src/domain/repositories/users-games.repository';
import { User } from 'src/domain/entities/user.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';

@Module({
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([Game, UsersGames, User, UserProfile])],
  providers: [
    GameService,
    GameRepository,
    UsersGamesRepository,
    UserRepository,
    UserProfileRepository,
  ],
})
export class GameModule {}
