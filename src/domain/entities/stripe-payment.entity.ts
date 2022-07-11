import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

export enum PaymentStatus {
    Pending = 'pending',
    Succeeded = 'succeeded'
}

@Entity('payments')
export class Payment {
    @PrimaryColumn()
    stripePaymentId!: string;

    @CreateDateColumn({ precision: 0, default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
    createdAt!: Date;

    @Column('enum', { enum: PaymentStatus })
    status!: PaymentStatus;

    @Column('decimal', { scale: 2, precision: 13})
    chargeAmount!: string;

    @Column('char', { length: 3 })
    chargeCurrency!: string;

    @Column()
    userId!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;
}