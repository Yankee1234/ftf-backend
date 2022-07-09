import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtToken } from "../entities/token.entity";
import { UsersGames } from "../entities/users-games.entity";

interface UserGame {
    userId: number;
    gameId: number;
}

@Injectable()
export class UsersGamesRepository {

  constructor(@InjectRepository(UsersGames) private repo: Repository<UsersGames>) {}

    create() {
        return this.repo.create();
    }
    
    async save(game: UsersGames) {
        await this.repo.save(game);
    }

    async findUserGameByIds(data: UserGame) {
        return await this.repo.createQueryBuilder('ug')
        .where('ug.userId = :userId')
        .andWhere('ug.gameId = :gameId')
        .setParameters({ userId: data.userId, gameId: data.gameId })
        .getOne();
    }
}