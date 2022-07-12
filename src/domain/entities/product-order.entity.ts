import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
}

@Entity('products_orders')
export class ProductOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.Pending })
  status!: OrderStatus;

  @Column('decimal', { scale: 2, precision: 13 })
  totalAmount!: string;

  @Column('char', { length: 3 })
  totalCurrency!: string;
}
