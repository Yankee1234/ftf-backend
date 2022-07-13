import { CreateDateColumn } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { UsersGames } from './users-games.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @CreateDateColumn({
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt!: Date;
}
