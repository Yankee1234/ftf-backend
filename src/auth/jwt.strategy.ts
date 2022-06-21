import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRole } from './security';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';

export type AuthIdentity = { id: number; login: string; role: AuthRole };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @Inject('USER_SERVICE') private readonly authClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AuthIdentity): Promise<AuthIdentity> {
    const user = await new Promise<boolean>((resolve) => {
      const oUser = this.authClient.send(
        { cmd: 'get-user-by-login' },
        { login: payload.login },
      );

      oUser.subscribe((data) => {
        if (data === 'user-exists') resolve(true);
        else resolve(false);
      });
    });
    //const user = await this.userRepo.findByLogin(payload.login);
    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
