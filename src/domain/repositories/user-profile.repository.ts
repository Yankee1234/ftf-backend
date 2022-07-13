import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, QueryBuilder, Repository } from 'typeorm';
import { UserProfile, UserProfileRole } from '../entities/user-profile.entity';

interface ICreateUserProfile {
  userId: number;
  userName: string;
  phoneNumber?: string;
}

@Injectable()
export class UserProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private readonly repo: Repository<UserProfile>,
  ) {}

  createProfile(user: ICreateUserProfile) {
    const profile = this.repo.create();
    profile.userId = user.userId;
    profile.userName = user.userName;
    profile.phoneNumber = user.phoneNumber;
    profile.role = UserProfileRole.Newbie;

    return profile;
  }

  async save(user: UserProfile) {
    await this.repo.save<UserProfile>(user);
  }

  async getUserProfileById(userId: number) {
    const query = this.repo.createQueryBuilder('profile');

    query
      .innerJoinAndSelect('profile.user', 'u')
      .where('profile.userId = :userId', { userId });

    return await query.getOne();
  }

  async getAll() {
    console.log('here');
    return await this.repo
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.user', 'u')
      .getMany();
  }
}
