import { ApiProperty } from '@nestjs/swagger';
import { UserProfileRole } from 'src/domain/entities/user-profile.entity';
import { GameItem } from './game-item.dto';

export class UserProfileResponse {
  @ApiProperty()
  userName!: string;

  @ApiProperty()
  avatarId?: number;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserProfileRole })
  role!: UserProfileRole;

  games: GameItem[] = [];
}
