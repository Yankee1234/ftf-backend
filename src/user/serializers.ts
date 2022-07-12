import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { GameItem } from './dtos/game-item.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';

export function toUserProfileDto(user: UserProfile): UserProfileResponse {
  const dto = new UserProfileResponse();
  dto.userName = user.userName ?? user.user.login;
  dto.email = user.user.email;
  dto.role = user.role;

  for (let i = 0; i < user.games.length; i += 1) {
    const game = user.games[i].game;

    dto.games.push(new GameItem(user.userId, game.id, game.name));
  }

  return dto;
}
