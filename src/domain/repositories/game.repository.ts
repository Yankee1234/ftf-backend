import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";
import { Game } from "../entities/game.entity";

@Injectable()
export class GameRepository {

    constructor(@InjectRepository(Game) private repo: Repository<Game>) {}

    create() {
        return this.repo.create();
    }

    async save(game: Game) {
        await this.repo.save(game);
    }

    async getAllGames() {
        return await this.repo.createQueryBuilder('g')
        .getMany();
    }

    async getByName(name: string) {
        return await this.repo.createQueryBuilder('g')
        .where('g.name = :name', { name })
        .getOne();
    }

    async getById(id: number) {
        return await this.repo.createQueryBuilder('g')
        .where('g.id = :id', { id })
        .getOne();
    }

    async removeById(id: number) {
        await this.repo.createQueryBuilder('g')
        .where('g.id = :id', { id })
        .delete()
        .execute();
    }
}