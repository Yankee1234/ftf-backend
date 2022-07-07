import { Body, UnauthorizedException } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { AuthRole } from 'src/auth/security';
import { AddGameRequest } from './dtos/add-game-request.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}
    
    @Post()
    @Auth()
    @ApiBody({ type: AddGameRequest })
    async addGame(@Req() req: PrivateRequest, @Body() data: AddGameRequest) {
        if(req.user.role !== AuthRole.Admin) throw new UnauthorizedException('You are not an admin');
        
    }
}
