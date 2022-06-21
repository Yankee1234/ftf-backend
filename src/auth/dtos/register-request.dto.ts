import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UserRegisterRequest {
    @ApiProperty()
    login!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    password!: string;

    @ApiProperty()
    userName!: string;

    @ApiProperty()
    loginNow!: boolean;
}