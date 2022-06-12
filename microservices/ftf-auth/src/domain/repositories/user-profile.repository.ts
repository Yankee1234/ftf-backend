import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { BaseRepository } from "utils/typeorm/BaseRepository";
import { UserProfile } from "../entities/user-profile.entity";


@Injectable()
@EntityRepository(UserProfile)
export class UserProfileRepository extends BaseRepository<UserProfile> {
    create() {
        return this.repository.create();
    }

    async save(profile: UserProfile) {
        await this.repository.save(profile);
    }
}