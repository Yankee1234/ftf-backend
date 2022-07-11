import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text', { nullable: false})
    message!: string;

    @CreateDateColumn({ precision: 0, default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    readAt!: Date | null;

    @Column()
    userId!: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({name:'userId'})
    user!: User;
}