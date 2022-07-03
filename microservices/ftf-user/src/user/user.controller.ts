import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GETTING_PROFILE_FAILED, GETTING_PROFILE_SUCCESSFUL, UPDATING_PROFILE_FAILED, UPDATING_PROFILE_SUCCESSFUL } from 'src/constants/constants';
import { UpdateProfileRequest } from '../../../../src/user/dtos/update-profile-request.dto';
import { UserProfileRequest } from './dtos/user-profile-request.dto';
import { UserDetails, UserProfileResponse } from './dtos/user-profile-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @MessagePattern({ cmd: 'get-profile' })
    async getProfile(data: UserProfileRequest) {
        try {
            const user = await this.userService.getProfileById(data.userId, false);

            return new UserProfileResponse(GETTING_PROFILE_SUCCESSFUL, { userId: user.userId, userName: user.userName })
        } catch(err) {
            return new UserProfileResponse(GETTING_PROFILE_FAILED, err.message);
        }
    }

    @MessagePattern({ cmd: 'get-all-users-profiles'})
    async getUsers() {
        try {
            const users = await this.userService.getAllProfilesWithUsers();

            let usersProfiles: UserDetails[] = [];

            for(let i = 0; i < users.length; i += 1) {
                const user = users[i];
                usersProfiles.push({userId: user.userId, userName: user.userName, login: user.user.login, email: user.user.email, phoneNumber: user.phoneNumber});
            }

            return new UserProfileResponse(GETTING_PROFILE_SUCCESSFUL, usersProfiles);
        } catch(err) {
            return new UserProfileResponse(GETTING_PROFILE_FAILED, err.message)
        }
    }

    @MessagePattern({ cmd: 'update-profile' })
    async updateProfile(data: UpdateProfileRequest) {
        try {
            const user = await this.userService.updateProfile(data);

            return new UserProfileResponse(UPDATING_PROFILE_SUCCESSFUL, { userId: user.userId, userName: user.userName, email: user.user.email,
            phoneNumber: user.phoneNumber });
        } catch(err) {
            return new UserProfileResponse(UPDATING_PROFILE_FAILED, err.message);
        }
    }
}
