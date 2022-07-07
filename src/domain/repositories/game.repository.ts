import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/utils/typeorm/BaseRepository";
import { EntityRepository } from "typeorm/decorator/EntityRepository";
import { Game } from "../entities/game.entity";

@Injectable()
@EntityRepository(Game)
export class GameRepository extends BaseRepository<Game> {
    create() {
        return this.repository.create();
    }

    async save(game: Game) {
        await this.repository.save(game);
    }

    async getAllGames() {
        return await this.repository.createQueryBuilder('g')
        .getMany();
    }
}