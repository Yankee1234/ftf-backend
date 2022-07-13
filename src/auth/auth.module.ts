import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { User } from 'src/domain/entities/user.entity';
import { JwtToken } from 'src/domain/entities/token.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { AdminProfile } from 'src/domain/entities/admin-profile.entity';
import { AdminProfileRepository } from 'src/domain/repositories/admin-profile.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../../.env' }),
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
    TypeOrmModule.forFeature([User, JwtToken, UserProfile, AdminProfile]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    TokenRepository,
    UserProfileRepository,
    AdminProfileRepository
  ],
})
export class AuthModule {}
