export class UserProfileResponse {
    constructor(readonly message: string, readonly data: string | UserDetails) {}ing;
}

interface UserDetails {
    userId: string;
    userName: string;
}