import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from 'src/domain/repositories/game.repository';

@Module({
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([GameRepository])],
  providers: [GameService]
})
export class GameModule {}
