import { Game } from "src/domain/entities/game.entity";
import { Game as GameDto} from "src/game/dtos/game.dto";

export function toGameDto(game: Game) {
    return new GameDto(game.id, game.name);
}