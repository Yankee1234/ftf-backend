import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOrder } from './product-order.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

export enum PaymentStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Canceled = 'canceled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  stripePaymentId!: string;

  @CreateDateColumn({
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt!: Date;

  @Column('enum', { enum: PaymentStatus, default: PaymentStatus.Pending })
  status!: PaymentStatus;

  @Column('decimal', { scale: 2, precision: 13 })
  chargeAmount!: string;

  @Column('char', { length: 3 })
  chargeCurrency!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  orderId!: number;

  @OneToOne(() => ProductOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: ProductOrder;

  @Column({ nullable: true })
  receiptUrl!: string | null;
}
