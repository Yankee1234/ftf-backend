import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @CreateDateColumn({ precision: 0, default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
    createdAt!: Date;
    
    @Column()
    stripeProductId!: string;

    @Column()
    stripePriceId!: string;

    @Column('decimal', { scale: 2, precision: 13})
    moneyAmount!: string;

    @Column('char', { length: 3 })
    moneyCurrency!: string;
}