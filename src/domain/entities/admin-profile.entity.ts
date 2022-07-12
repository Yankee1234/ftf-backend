import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserFile } from './user-file.entity';
//import { UserFile } from "./user-file.entity";
import { User } from './user.entity';

export enum AdminRole {
  Admin = 'admin',
  SuperAdmin = 'super-admin',
  Helper = 'helper',
}

@Entity('admin_profiles')
export class AdminProfile {
  @PrimaryColumn()
  userId!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('enum', { enum: AdminRole })
  role!: AdminRole;

  @OneToOne(() => UserFile, { nullable: true })
  avatar?: UserFile | null;

  @Column({ nullable: true })
  avatarId?: number | null;
}
