import { Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthLoginRequest } from './dtos/auth-login.dto';
import { GoogleAuthRequest } from './dtos/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @ApiBody({ type: AuthLoginRequest })
  @ApiOperation({ summary: 'Login' })
  async login(@Body() login: AuthLoginRequest) {}

  @Post('google-auth')
  @ApiOperation({ summary: 'login with google' })
  @ApiBody({ type: GoogleAuthRequest })
  async loginGoogle(@Body() req: GoogleAuthRequest) {}
}
