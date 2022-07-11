import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}