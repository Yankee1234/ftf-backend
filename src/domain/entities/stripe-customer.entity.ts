import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('stripe_customers')
export class StripeCustomer {
  @PrimaryColumn()
  stripeCustomerId: string;

  @Column()
  userId!: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt!: Date;
}
