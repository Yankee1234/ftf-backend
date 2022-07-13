import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProfile } from 'src/domain/entities/admin-profile.entity';
import { AdminProfileRepository } from 'src/domain/repositories/admin-profile.repository';
import { AdministratorController } from './administrator.controller';
import { AdministratorService } from './administrator.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminProfile])],
  controllers: [AdministratorController],
  providers: [AdministratorService, AdminProfileRepository],
})
export class AdministratorModule {}
