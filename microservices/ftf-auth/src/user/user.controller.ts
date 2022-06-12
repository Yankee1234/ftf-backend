import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GETTING_PROFILE_FAILED } from 'src/constants/constants';
import { UserProfileRequest } from './dtos/user-profile-request.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';

@Controller('user')
export class UserController {
    @MessagePattern({ cmd: 'get-profile' })
    async getProfile(data: UserProfileRequest) {
        try {
            
        } catch(err) {
            return new UserProfileResponse(GETTING_PROFILE_FAILED, err.message);
        }
    }
}
