import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, QueryBuilder, Repository } from "typeorm";
import { UserProfile, UserProfileRole } from "../entities/user-profile.entity";

interface ICreateUserProfile {
    userId: number;
    userName: string;
    phoneNumber?: string;
}

@Injectable()
export class UserProfileRepository {

    constructor(@InjectRepository(UserProfile) private repo: Repository<UserProfile>) {}

    createProfile(user: ICreateUserProfile) {
        const profile = this.repo.create();
        profile.userId = user.userId;
        profile.userName  =user.userName;
        profile.phoneNumber = user.phoneNumber;
        profile.role = UserProfileRole.Newbie;
        
        return profile;
    }

    async save(user: UserProfile) {
        await this.repo.save<UserProfile>(user);
    }

    async getUserProfileById(userId: number, withUser: boolean) {
        const query = this.repo.createQueryBuilder('p')

        if(withUser && withUser.toString() === 'true') query.innerJoinAndSelect('p.user', 'u');
        else query.innerJoin('p.user', 'u');
        query.leftJoinAndSelect('p.games', 'games')
        .leftJoinAndSelect('games.game', 'game')

        query.where('p.userId = :userId', { userId });

        return await query.getOne();
    }

    async getAll() {
        return await this.repo.createQueryBuilder('p')
        .innerJoinAndSelect('p.user', 'u')
        .getMany();
    }
}