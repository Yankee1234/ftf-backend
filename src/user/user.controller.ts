import { Controller, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { Param } from '@nestjs/common';
import { PrivateRequest } from 'src/auth/requests';
import { ParseIntPipe } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { AuthRole } from 'src/auth/security';
import { UnauthorizedException } from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':id')
    @Auth()
    @ApiOperation({ summary: 'Get user profile'})
    async getProfile(@Param('id', ParseIntPipe) id: number, @Req() req: PrivateRequest) {
        return await this.userService.getProfile(id);
    }

    @Get('profiles')
    @Auth()
    @ApiOperation({ summary: 'Get all users profiles'})
    async getProfiles(@Req() req: PrivateRequest) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');

        return await this.userService.getProfiles();
    }
}
