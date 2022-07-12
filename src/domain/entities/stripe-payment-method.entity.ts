import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PMType {
  Card = 'card',
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryColumn()
  paymentMethodId!: string;

  @CreateDateColumn({
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt!: Date;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('enum', { enum: PMType, default: PMType.Card })
  pmType!: PMType;

  @Column()
  lastNumbers!: string;
}
