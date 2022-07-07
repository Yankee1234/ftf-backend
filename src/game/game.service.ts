import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { GameRepository } from 'src/domain/repositories/game.repository';
import { QueryFailedError } from 'typeorm';
import { AddGameRequest } from './dtos/add-game-request.dto';

@Injectable()
export class GameService {
    constructor(private readonly gamesRepo: GameRepository) {}

    async addGame(req: AddGameRequest) {
        try {
            const game = this.gamesRepo.create();
            game.name = req.name;

            await this.gamesRepo.save(game);

            
        } catch(err) {
            if(err instanceof QueryFailedError) {
                if(err.message.includes('Duplicate entry')) {
                    throw new InternalServerErrorException('This game is existed')
                }
            }
        }
    }
}
