import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsReader } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {

        const connectionOptionsReader = new ConnectionOptionsReader({
            configName: 'ormconfig.js',
        });
        const connectionOptions: TypeOrmModuleOptions = await connectionOptionsReader.get(
            'default',
        );
        return connectionOptions;
    },
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
