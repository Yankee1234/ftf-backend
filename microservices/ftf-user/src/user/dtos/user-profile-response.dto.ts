export class UserProfileResponse {
    constructor(readonly message: string, readonly data: string | UserDetails | UserDetails[]) {};
}

export interface UserDetails {
    userId: number;
    userName: string;
    phoneNumber?: string;
    avatarId?: number;
    login?: string;
    email?: string;
}