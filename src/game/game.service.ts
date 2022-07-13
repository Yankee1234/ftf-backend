import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Game } from 'src/domain/entities/game.entity';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { GameRepository } from 'src/domain/repositories/game.repository';
import { UserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UsersGamesRepository } from 'src/domain/repositories/users-games.repository';
import { toUserProfileDto } from 'src/user/serializers';
import { AddGameRequest } from './dtos/add-game-request.dto';
import { AddUserGameRequest } from './dtos/add-user-game-request.dto';
import { toGameDto } from './serializers';

@Injectable()
export class GameService {
  constructor(
    private readonly gamesRepo: GameRepository,
    private readonly usersGamesRepo: UsersGamesRepository,
    private readonly usersRepo: UserRepository,
    private readonly profilesRepo: UserProfileRepository,
  ) {}

  async addGame(req: AddGameRequest) {
    try {
      const game = await this.gamesRepo.getByName(req.name);
      if (game) throw new InternalServerErrorException('This game is existed');

      const newGame = this.gamesRepo.create();
      newGame.name = req.name;

      await this.gamesRepo.save(newGame);

      return GameService.toGameDtoArray(await this.gamesRepo.getAllGames());
    } catch (err) {
      throw err;
    }
  }

  async getAllGames() {
    return GameService.toGameDtoArray(await this.gamesRepo.getAllGames());
  }

  async removeGame(id: number) {
    try {
      const game = await this.gamesRepo.getById(id);

      if (!game) throw new NotFoundException('This game is not found');

      await this.gamesRepo.removeById(id);

      return GameService.toGameDtoArray(await this.gamesRepo.getAllGames());
    } catch (err) {
      throw err;
    }
  }

  private static toGameDtoArray(games: Game[]) {
    if (games.length > 0) {
      return games.map((game) => toGameDto(game));
    }

    return [];
  }

  async addUserGame(req: AddUserGameRequest) {
    try {
    } catch (err) {
      throw err;
    }
    const user = await this.usersRepo.getById(req.userId);
    if (!user) throw new NotFoundException('User not found');

    const game = await this.gamesRepo.getById(req.gameId);
    if (!game) throw new NotFoundException('Game not found');

    const userGame = await this.usersGamesRepo.findUserGameByIds(req);
    if (userGame)
      throw new InternalServerErrorException('This user game exists');

    const newUserGame = this.usersGamesRepo.create();
    newUserGame.gameId = req.gameId;
    newUserGame.userId = req.userId;

    await this.usersGamesRepo.save(newUserGame);

    const profile = await this.profilesRepo.getUserProfileById(req.userId);
    const usersGames = await this.usersGamesRepo.getUsersGames(req.userId);

    return toUserProfileDto({ userProfile: profile, games: usersGames });
  }

  async getUsersGames(userId: number) {
    const games = await this.usersGamesRepo.getUsersGames(userId);

    return GameService.toGameDtoArray(games.map((g) => g.game));
  }
}
