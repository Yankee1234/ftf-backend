import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
//import { UserFile } from "./user-file.entity";
import { User } from "./user.entity";

export enum UserProfileRole {
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

    @Column('enum', { enum: UserProfileRole, default: UserProfileRole.Newbie })
    role!: UserProfileRole;

    /*@OneToOne(() => UserFile, { onDelete: 'CASCADE', nullable: true})
    avatar?: UserFile;*/

    @Column({ nullable: true })
    avatarId?: number;
}