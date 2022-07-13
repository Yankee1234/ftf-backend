import { Injectable } from '@nestjs/common';
import { AdminProfile } from 'src/domain/entities/admin-profile.entity';
import { AdminProfileRepository } from 'src/domain/repositories/admin-profile.repository';
import { AdminProfileResponse } from './dtos/admin-profile-response.dto';

@Injectable()
export class AdministratorService {

    constructor(private readonly adminRepo: AdminProfileRepository) {}

    async getProfile(id: number) {
        return AdministratorService.toAdminProfileResponseDto(await this.adminRepo.getByIdWithUser(id));
    }

    private static toAdminProfileResponseDto(profile: AdminProfile) {
        const dto = new AdminProfileResponse();
        dto.login = profile.user.login;
        dto.role = profile.role;

        return dto;
    }
}
