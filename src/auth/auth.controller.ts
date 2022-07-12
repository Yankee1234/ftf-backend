import { Post } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MicroserviceResponse } from 'src/common/dtos/microservice-response.dto';
import { AuthService } from './auth.service';
import { AuthLoginRequest } from './dtos/auth-login.dto';
import { GoogleAuthRequest } from './dtos/google-auth.dto';
import { UserRegisterRequest } from './dtos/register-request.dto';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: AuthLoginRequest })
  @ApiOperation({ summary: 'Login' })
  async login(@Body() req: AuthLoginRequest) {
    const resp = await this.authService.login(req);

    return resp;
  }

  @Post('google-auth')
  @ApiOperation({ summary: 'login with google' })
  @ApiBody({ type: GoogleAuthRequest })
  async loginGoogle(@Body() req: GoogleAuthRequest) {
    const resp = await this.authService.googleAuth(req);

    return resp;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: UserRegisterRequest })
  async register(@Body() req: UserRegisterRequest) {
    const resp = await this.authService.register(req);

    return resp;
  }
}
