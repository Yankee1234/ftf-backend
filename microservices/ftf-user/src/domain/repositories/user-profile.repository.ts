import { Injectable } from "@nestjs/common";
import { EntityRepository } from "typeorm";
import { BaseRepository } from "utils/typeorm/BaseRepository";
import { UserProfile, UserProfileRole } from "../entities/user-profile.entity";
import { UserRole } from "../entities/user.entity";

interface ICreateUserProfile {
    userId: number;
    userName: string;
    phoneNumber?: string;
}

@Injectable()
@EntityRepository(UserProfile)
export class UserProfileRepository extends BaseRepository<UserProfile> {
    create(user: ICreateUserProfile) {
        const profile = new UserProfile();
        profile.userId = user.userId;
        profile.userName  =user.userName;
        profile.phoneNumber = user.phoneNumber;
        profile.role = UserProfileRole.Newbie;
        
        return profile;
    }

    async save(user: UserProfile) {
        await this.repository.save(user);
    }

    async getUserProfileById(userId: number, withUser: boolean) {
        const query = this.createQueryBuilder('p')

        if(withUser && withUser.toString() === 'true') query.innerJoinAndSelect('p.user', 'u');
        else query.innerJoin('p.user', 'u');

        query.where('p.userId = :userId', { userId });

        return await query.getOne();
    }

    async getAll() {
        return await this.createQueryBuilder('p')
        .innerJoinAndSelect('p.user', 'u')
        .getMany();
    }
}