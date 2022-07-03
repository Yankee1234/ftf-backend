import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/utils/typeorm/BaseRepository";
import { EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
    create() {
        return this.repository.create();
    }

    async save(user: User) {
        await this.repository.save(user);
    }

    async getByLogin(login: string, email?: string) {
        const query = this.repository.createQueryBuilder('u')
        .where('u.login = :login', {login})

        if(email) query.andWhere('u.email = :email', { email });

        return await query.getOne();
    }
}