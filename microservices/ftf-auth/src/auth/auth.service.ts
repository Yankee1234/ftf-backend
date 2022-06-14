import {
  ForbiddenException,
  Inject,
  Injectable,  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginRequest } from './dtos/auth-login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth, google } from 'googleapis';
import { GoogleAuthRequest } from './dtos/google-auth-request.dto';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from 'src/domain/entities/user.entity';
import { AuthRegisterRequest } from './dtos/auth-register-request.dto';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtToken } from 'src/domain/entities/token.entity';

interface UserJwtInfo {
    id: number;
    login: string;
    role: UserRole;
}

@Injectable()
export class AuthService {

    private oAuthClient: Auth.OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepo: UserRepository,
    private readonly tokensRepo: TokenRepository,
    private readonly config: ConfigService
  ) {
    const clientId = this.config.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get('GOOGLE_CLIENT_SECRET');

    this.oAuthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

  async login(data: AuthLoginRequest): Promise<string> {
      const user = await this.usersRepo.findByLogin(data.login);
      if (!user || !(await bcrypt.compare(data.password, user.password)))
        throw new UnauthorizedException('Invalid login or password');

      return this.generateJwtToken({id: user.id, login: user.login, role: user.role});
  }

  async googleAuth(data: GoogleAuthRequest): Promise<string> {
    try {
        const tokenInfo = await this.oAuthClient.getTokenInfo(data.accessToken);

        const user = await this.usersRepo.findByLogin(tokenInfo.email);
        if(!user) throw new UnauthorizedException('Auth is not successful');

        return this.generateJwtToken({id: user.id, login: user.login, role: user.role});
    } catch(err) {
        if(err.status !== 404) throw new err;

        return await this.registerGoogleUser(data.accessToken);
    }
  }

  async registerGoogleUser(accessToken: string): Promise<string> {
      const userInfo = await this.getGoogleUserData(accessToken);
    const user = this.usersRepo.create();
    user.email = userInfo.email;
    user.login = userInfo.email;
    user.role = UserRole.User;

    await this.usersRepo.save(user);

    return await this.generateJwtToken({id: user.id, login: user.login, role: user.role});
  }

  async getGoogleUserData(token: string) {
      try {
        const userInfoClient = google.oauth2('v2').userinfo;
    
        this.oAuthClient.setCredentials({
        access_token: token
        })
    
        const userInfoResponse = await userInfoClient.get({
            auth: this.oAuthClient
        });

        return userInfoResponse.data;
      } catch(err) {
        throw new err;
      }
  }

  private async generateJwtToken(user: UserJwtInfo): Promise<string>{

    const tokenString = await this.jwtService.signAsync({
        id: user.id,
        login: user.login,
        role: user.role,
      });

      const newToken = this.tokensRepo.create();
      newToken.token = tokenString;
      await this.tokensRepo.save(newToken);

      return newToken.token;
  }

  async register(data: AuthRegisterRequest) {
    const user = await this.usersRepo.findByLogin(data.login, data.email);
    if(user) throw new ForbiddenException('User exists');

    const newUser = this.usersRepo.create();
    newUser.login = data.login;
    newUser.email = data.email;
    newUser.password = await this.hashPassword(data.password);

    /*const profile = this.userProfilesRepo.create();

    profile.userName = data.userName;

    await this.userProfilesRepo.save(profile);*/
    await this.usersRepo.save(newUser);

    if(data.loginNow && data.loginNow.toString() === 'true') {
      const tokenString = await this.jwtService.signAsync({
        id: newUser.id,
        login: newUser.login,
        role: newUser.role,
      });
      const newToken = this.tokensRepo.create();
      newToken.token = tokenString;
      await this.tokensRepo.save(newToken);

      return newToken.token;
    }

    return;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 1);
  }
}