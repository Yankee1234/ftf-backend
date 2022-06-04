import { Column } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";

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

    @Column()
    email!: string;
}
