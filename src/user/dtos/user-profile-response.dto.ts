import { ApiProperty } from "@nestjs/swagger";

export class UserProfileResponse {
    @ApiProperty()
    userId!: number;

    @ApiProperty()
    userName!: string;

    @ApiProperty()
    phoneNumber?: string;

    @ApiProperty()
    avatarId?: number;

    @ApiProperty()
    login?: string;

    @ApiProperty()
    email?: string;
}