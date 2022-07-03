import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRole } from './security';
import { UserRepository } from 'src/domain/repositories/user.repository';

export type AuthIdentity = { id: number; login: string; role: AuthRole };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: AuthIdentity): Promise<AuthIdentity> {
    const user = await this.userRepository.getByLogin(payload.login);
    //const user = await this.userRepo.findByLogin(payload.login);
    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
