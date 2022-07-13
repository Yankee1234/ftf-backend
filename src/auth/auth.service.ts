import { Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { AuthLoginRequest } from './dtos/auth-login.dto';
import { GoogleAuthRequest } from './dtos/google-auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRole } from 'src/domain/entities/user.entity';
import { AuthRegisterRequest } from './dtos/auth-register-request.dto';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { AdminProfileRepository } from 'src/domain/repositories/admin-profile.repository';
import { AdminRole } from 'src/domain/entities/admin-profile.entity';
import { AuthRole } from './security';

@Injectable()
export class AuthService {
  private oAuthClient: Auth.OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensRepo: TokenRepository,
    private readonly config: ConfigService,
    private readonly userProfilesRepo: UserProfileRepository,
    private readonly usersRepo: UserRepository,
    private readonly adminsRepo: AdminProfileRepository,
  ) {
    const clientId = this.config.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get('GOOGLE_CLIENT_SECRET');

    this.oAuthClient = new google.auth.OAuth2(clientId, clientSecret);
  }

  async login(data: AuthLoginRequest): Promise<string> {
    const user = await this.usersRepo.getByLogin(data.login);
    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new UnauthorizedException('Invalid login or password');

    return this.generateJwtToken({
      id: user.id,
      login: user.login,
      role: user.role,
    });
  }

  async googleAuth(data: GoogleAuthRequest): Promise<string> {
    try {
      const tokenInfo = await this.oAuthClient.getTokenInfo(data.token);

      const user = await this.usersRepo.getByLogin(tokenInfo.email);
      if (!user) throw new UnauthorizedException('Auth is not successful');

      return this.generateJwtToken({
        id: user.id,
        login: user.login,
        role: user.role,
      });
    } catch (err) {
      if (err.status !== 404) throw new err();

      return await this.registerGoogleUser(data.token);
    }
  }

  async registerGoogleUser(accessToken: string): Promise<string> {
    const userInfo = await this.getGoogleUserData(accessToken);
    const user = this.usersRepo.create();
    user.email = userInfo.email;
    user.login = userInfo.email;
    user.role = UserRole.User;

    await this.usersRepo.save(user);

    return await this.generateJwtToken({
      id: user.id,
      login: user.login,
      role: user.role,
    });
  }

  async getGoogleUserData(token: string) {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;

      this.oAuthClient.setCredentials({
        access_token: token,
      });

      const userInfoResponse = await userInfoClient.get({
        auth: this.oAuthClient,
      });

      return userInfoResponse.data;
    } catch (err) {
      throw new err();
    }
  }

  private async generateJwtToken(user: UserJwtInfo): Promise<string> {
    var d = new Date();

    var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);
    const tokenString = await this.jwtService.signAsync({
      id: user.id,
      login: user.login,
      role: user.role,
    }, {expiresIn: calculatedExpiresIn});

    const newToken = this.tokensRepo.create();
    newToken.token = tokenString;
    await this.tokensRepo.save(newToken);

    return newToken.token;
  }

  async register(data: AuthRegisterRequest) {
    try {
      const user = await this.usersRepo.getByLogin(data.login, data.email);
      if (user) throw new ForbiddenException('User exists');

      const newUser = this.usersRepo.create();
      newUser.login = data.login;
      newUser.email = data.email;
      newUser.password = await this.hashPassword(data.password);
      newUser.role = UserRole.User;
      await this.usersRepo.save(newUser);

      const profile = this.userProfilesRepo.createProfile({
        userId: newUser.id,
        userName: data.userName,
      });

      await this.userProfilesRepo.save(profile);

      var d = new Date();

      var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);

      if (data.loginNow && data.loginNow.toString() === 'true') {
        const tokenString = await this.jwtService.signAsync({
          id: newUser.id,
          login: newUser.login,
          role: newUser.role,   
        }, { expiresIn: calculatedExpiresIn});
        const newToken = this.tokensRepo.create();
        newToken.token = tokenString;
        await this.tokensRepo.save(newToken);

        return newToken.token;
      }

      return;
    } catch (err) {
      throw err;
    }
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 1);
  }

  async getUserByLogin(login: string) {}
}

interface UserJwtInfo {
  id: number;
  login: string;
  role: UserRole;
}
