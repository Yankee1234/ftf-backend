import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

export enum AdminRole {
    Admin = 'admin',
    SuperAdmin = 'super-admin',
    Helper = 'helper'
}

@Entity('admin_profiles')
export class AdminProfile {
    @PrimaryColumn()
    userId!: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column('enum', { enum: AdminRole })
    role!: AdminRole;

    /*@OneToOne(() => UserFile, { onDelete: 'CASCADE', nullable: true})
    avatar?: UserFile;*/

    @Column({ nullable: true })
    avatarId?: number;
}