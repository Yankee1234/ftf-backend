import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { GameItem } from './dtos/game-item.dto';
import { UserProfileResponse } from './dtos/user-profile-response.dto';
import { IUserProfile } from './user.service';

export function toUserProfileDto(user: IUserProfile): UserProfileResponse {
  const dto = new UserProfileResponse();
  const { userProfile, games} = user;
  dto.userName = userProfile.userName ?? userProfile.user.login;
  dto.email = userProfile.user.email;
  dto.role = userProfile.role;

  for (let i = 0; i < user.games.length; i += 1) {
    const game = user.games[i].game;

    dto.games.push(new GameItem(userProfile.userId, game.id, game.name));
  }

  return dto;
}
