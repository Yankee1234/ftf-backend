import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tokens')
export class JwtToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: true })
  isActive!: boolean;
}
