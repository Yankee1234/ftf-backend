import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LOGIN_FAILED, LOGIN_SUCCESSFUL, REGISTER_FAILED, REGISTER_SUCCESSFUL } from '../constants/constants';
import { AuthLoginRequest } from './dtos/auth-login-request.dto';
import { AuthResponse } from './dtos/auth-response.dto';
import { AuthRegisterRequest } from './dtos/auth-register-request.dto';
import { GoogleAuthRequest } from './dtos/google-auth-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*@MessagePattern({ cmd: 'auth-login' })
  async login(data: AuthLoginRequest): Promise<AuthResponse> {
    try {
      const token = await this.authService.login(data);

      return new AuthResponse(LOGIN_SUCCESSFUL, token);
    } catch (err) {
      return new AuthResponse(LOGIN_FAILED, err.message);
    }
  }

  @MessagePattern({ cmd: 'google-auth' })
  async googleAuth(data: GoogleAuthRequest) {
      try {
        const token = await this.authService.googleAuth(data);

        return new AuthResponse(LOGIN_SUCCESSFUL, token);
      } catch(err) {
        return new AuthResponse(LOGIN_FAILED, err.message)
      }
  }

  @MessagePattern({ cmd: 'auth-register'})
  async register(data: AuthRegisterRequest) {
    try {
      if(data.loginNow && data.loginNow.toString() === 'true') {
        const token = await this.authService.register(data);

        return new AuthResponse(REGISTER_SUCCESSFUL, token);
      }

      return new AuthResponse(REGISTER_SUCCESSFUL);
    } catch(err) {
      return new AuthResponse(REGISTER_FAILED, err.message);
    }
  }*/
}
