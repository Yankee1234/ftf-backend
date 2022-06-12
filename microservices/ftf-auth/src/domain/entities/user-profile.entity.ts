import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

export enum UserRole {
    Newbie = 'newbie',
    Subscriber = 'subscriber',
    OldGuard = 'old-guard',
}

@Entity('users_profiles')
export class UserProfile {
    @PrimaryColumn()
    userId!: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ nullable: true })
    userName?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column('enum', { enum: UserRole, default: UserRole.Newbie })
    role!: UserRole;
}