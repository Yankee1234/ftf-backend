import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { JoinColumn } from "typeorm/decorator/relations/JoinColumn";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { Game } from "./game.entity";
import { UserProfile } from "./user-profile.entity";

@Entity('users_games')
export class UsersGames {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => UserProfile, (user) => user.games, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: UserProfile;

    @Column()
    gameId!: number;

    @ManyToOne(() => Game, (game) => game.usersGames, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'gameId' })
    game!: Game;
}