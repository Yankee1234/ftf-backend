import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserFile } from './user-file.entity';
//import { UserFile } from "./user-file.entity";
import { User } from './user.entity';
import { UsersGames } from './users-games.entity';

export enum UserProfileRole {
  Newbie = 'newbie',
  Subscriber = 'subscriber',
  OldGuard = 'old-guard',
}

@Entity('users_profiles')
export class UserProfile {
  @PrimaryColumn()
  userId!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: true })
  userName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column('enum', { enum: UserProfileRole, default: UserProfileRole.Newbie })
  role!: UserProfileRole;

  @OneToOne(() => UserFile, { nullable: true })
  avatar?: UserFile | null;

  @Column({ nullable: true })
  avatarId?: number | null;

  @OneToMany(() => UsersGames, (game) => game.game)
  games!: UsersGames[];
}
