import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '10m',
        },
      }),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository, TokenRepository, UserProfileRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
