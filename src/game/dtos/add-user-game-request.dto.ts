import { ApiProperty } from '@nestjs/swagger';

export class AddUserGameRequest {
  @ApiProperty()
  userId!: number;

  @ApiProperty()
  gameId!: number;
}
