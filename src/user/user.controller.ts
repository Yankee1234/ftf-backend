import { Controller, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { Param } from '@nestjs/common';
import { PrivateRequest } from 'src/auth/requests';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { AuthRole } from 'src/auth/security';
import { UnauthorizedException } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { UserProfileResponse } from './dtos/user-profile-response.dto';
import { toUserProfileDto } from './serializers';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':id')
    @Auth()
    @ApiOperation({ summary: 'Get user profile'})
    @ApiOkResponse({ type: UserProfileResponse })
    async getProfile(@Param('id') id: string, @Req() req: PrivateRequest) {
        return toUserProfileDto(await this.userService.getProfileById(id === 'me' ? req.user.id : +id, false));
    }

    @Get('profiles')
    @Auth()
    @ApiOperation({ summary: 'Get all users profiles'})
    async getProfiles(@Req() req: PrivateRequest) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');

        return await this.userService.getAllProfilesWithUsers();
    }

    @Get(':id/all')
    @Auth()
    @ApiOperation({ summary: 'Get full user profile by admin'})
    async getProfileForAdmin(@Req() req: PrivateRequest, @Param('id', ParseIntPipe) id: number) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');

        return await this.userService.getProfileById(id, true);
    }

}
