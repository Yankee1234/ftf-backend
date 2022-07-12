import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileEmbedded } from '../embedded/file';
import { User } from './user.entity';

@Entity('users_files')
export class UserFile extends FileEmbedded {
  @Column()
  userId!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
