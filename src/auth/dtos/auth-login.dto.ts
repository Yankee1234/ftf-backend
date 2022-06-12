import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequest {
  @ApiProperty()
  login!: string;

  @ApiProperty()
  password!: string;
}
