import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  login!: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column()
  email!: string;

  @Column('enum', { enum: UserRole, default: UserRole.User })
  role!: UserRole;
}
