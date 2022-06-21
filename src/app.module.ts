import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'USER_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          port: configService.get('USER_PORT')
        }
      })
    }],
})
export class AppModule {}
