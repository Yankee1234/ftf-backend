import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    User = 'user',
    Admin = 'admin'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    login!: string;

    @Column()
    password!: string;

    @Column('enum', { enum: UserRole })
    role!: UserRole;
}