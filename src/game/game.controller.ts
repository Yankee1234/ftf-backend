import { Body, Delete, Get, Param, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { AuthRole } from 'src/auth/security';
import { UserProfileResponse } from 'src/user/dtos/user-profile-response.dto';
import { AddGameRequest } from './dtos/add-game-request.dto';
import { AddUserGameRequest } from './dtos/add-user-game-request.dto';
import { GameService } from './game.service';
import { toGameDto } from './serializers';

@Controller('game')
@ApiTags('Game')
export class GameController {
    constructor(private readonly gameService: GameService) {}
    
    @Post()
    @Auth()
    @ApiBody({ type: AddGameRequest })
    @ApiOperation({ summary: 'Add(create) new game by admin'})
    async addGame(@Req() req: PrivateRequest, @Body() data: AddGameRequest) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');

        return await this.gameService.addGame(data);
    }

    @Get()
    @Auth()
    @ApiOperation({ summary: 'Get all games' })
    async getAllGames(@Req() req: PrivateRequest) {
        return await this.gameService.getAllGames();
    }

    @Delete(':id')
    @Auth()
    @ApiParam({ name: 'id', type: String})
    @ApiOperation({ summary: 'Remove game from games list'})
    async removeGame(@Req() req: PrivateRequest, @Param('id', ParseIntPipe) id: number) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');

        return await this.gameService.removeGame(id);
    }

    @Post('/user-add')
    @Auth()
    @ApiBody({ type: AddUserGameRequest})
    @ApiOperation({ summary: 'Add game to user games list'})
    @ApiOkResponse({ type: UserProfileResponse })
    async addUserGame(@Req() req: PrivateRequest, @Body() data: AddUserGameRequest) {
        if(req.user.role !== AuthRole.User) throw new UnauthorizedException('You are not a user');

        return await this.gameService.addUserGame(data);
    }
}
