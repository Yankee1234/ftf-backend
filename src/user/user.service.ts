import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { MicroserviceResponse } from 'src/common/dtos/microservice-response.dto';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { UsersGames } from 'src/domain/entities/users-games.entity';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UsersGamesRepository } from 'src/domain/repositories/users-games.repository';
import { UpdateProfileRequest } from './dtos/update-profile-request.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';

export interface IUserProfile {
  userProfile: UserProfile;
  games: UsersGames[];
}

@Injectable()
export class UserService {
  constructor(
    private readonly profilesRepo: UserProfileRepository,
    private readonly usersRepo: UserRepository,
    private readonly usersGamesRepo: UsersGamesRepository,
  ) {}

  async getProfileById(
    userId: number,
    withUser: boolean,
  ): Promise<IUserProfile> {
    const user = await this.profilesRepo.getUserProfileById(userId);
    if (!user) throw new NotFoundException('User not found');

    const games = await this.usersGamesRepo.getUsersGames(userId);
    return { userProfile: user, games: games };
  }

  async getAllProfilesWithUsers() {
    return await this.profilesRepo.getAll();
  }

  async updateProfile(data: UpdateProfileRequest) {
    const { userProfile } = await this.getProfileById(data.userId, true);
    const user = userProfile.user;

    userProfile.userName = data.userName ?? userProfile.userName;
    userProfile.phoneNumber = data.phoneNumber ?? userProfile.phoneNumber;
    user.email = data.email ?? user.email;

    await this.profilesRepo.save(userProfile);
    await this.usersRepo.save(user);

    return userProfile;
  }
}
