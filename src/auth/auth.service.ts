import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { AuthLoginRequest } from './dtos/auth-login.dto';
import { GoogleAuthRequest } from './dtos/google-auth.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private oAuthCLient: Auth.OAuth2Client;
  constructor(
    private readonly config: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {
    const clientId = this.config.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get('GOOGLE_CLIENT_SECRET');

    this.oAuthCLient = new google.auth.OAuth2(clientId, clientSecret);
  }

  async login(req: AuthLoginRequest) {
    const observable = await this.authClient.send(
      { cmd: 'auth-login' },
      { login: req.login, password: req.password },
    );

    return await new Promise<string>((resolve) => {
      observable.subscribe((data) => {
        if (data === 'login-failed') throw new UnauthorizedException();
        else resolve(data);
      });
    });
  }

  async googleLogin(req: GoogleAuthRequest) {
    const tokenInfo = await this.oAuthCLient.getTokenInfo(req.token);

    const email = tokenInfo.email;
  }
}
