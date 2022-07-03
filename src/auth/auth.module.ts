import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../../.env'}),
    PassportModule,
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
    TypeOrmModule.forFeature([UserRepository, TokenRepository, UserProfileRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
