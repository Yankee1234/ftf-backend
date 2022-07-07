import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  Active = 'active',
  NotActive = 'not-active'
}

@Entity('tokens')
export class JwtToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @CreateDateColumn({ precision: 0, default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt!: Date;

  @Column({default: true})
  isActive!: boolean;
}
