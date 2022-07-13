import { AdminRole } from "src/domain/entities/admin-profile.entity";

export class AdminProfileResponse {
    login!: string;

    role!: AdminRole;
}