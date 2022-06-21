import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { AuthLoginRequest } from './dtos/auth-login.dto';
import { GoogleAuthRequest } from './dtos/google-auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserRegisterRequest } from './dtos/register-request.dto';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { ForbiddenException } from '@nestjs/common';
import { MicroserviceResponse } from 'src/common/dtos/microservice-response.dto';

@Injectable()
export class AuthService {
  private oAuthCLient: Auth.OAuth2Client;
  constructor(
    private readonly config: ConfigService,
    @Inject('USER_SERVICE') private readonly authClient: ClientProxy,
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

    return await new Promise<MicroserviceResponse>((resolve) => {
      observable.subscribe((data) => {
        resolve(data);
      });
    });
  }

  async googleLogin(req: GoogleAuthRequest) {
    const observable = await this.authClient.send({cmd: 'google-auth'}, { token: req.token })

    return await new Promise<MicroserviceResponse>((resolve) => {
      observable.subscribe((data) => {
        resolve(data);
      })
    })
  }

  async register(req: UserRegisterRequest) {
    const observable = await this.authClient.send({cmd: 'auth-register'}, req);

    return await new Promise<MicroserviceResponse>((resolve) => {
      observable.subscribe((data) => {
        resolve(data);
      })
    })
  }
}
