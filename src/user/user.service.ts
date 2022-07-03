import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { UserProfile } from 'microservices/ftf-user/src/domain/entities/user-profile.entity';
import { MicroserviceResponse } from 'src/common/dtos/microservice-response.dto';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UpdateProfileRequest } from './dtos/update-profile-request.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly profilesRepo: UserProfileRepository,
        private readonly usersRepo: UserRepository
    ) {}

    async getProfileById(userId: number, withUser: boolean) {
        const user = await this.profilesRepo.getUserProfileById(userId, withUser);
        if(!user) throw new NotFoundException('User not found');

        return user;
    }

    async getAllProfilesWithUsers() {
        return await this.profilesRepo.getAll();
    }

    async updateProfile(data: UpdateProfileRequest) {
        const profile = await this.getProfileById(data.userId, true);
        const user = profile.user;

        profile.userName = data.userName ?? profile.userName;
        profile.phoneNumber = data.phoneNumber ?? profile.phoneNumber;
        user.email = data.email ?? user.email;

        await this.profilesRepo.save(profile);
        await this.usersRepo.save(user);

        return profile;
    }
}
