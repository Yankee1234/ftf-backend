import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsReader } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ShopModule } from './shop/shop.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const connectionOptionsReader = new ConnectionOptionsReader({
          configName: 'ormconfig.js',
        });
        const connectionOptions: TypeOrmModuleOptions =
          await connectionOptionsReader.get('default');
        return connectionOptions;
      },
    }),
    GameModule,
    ShopModule,
    LoggerModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
