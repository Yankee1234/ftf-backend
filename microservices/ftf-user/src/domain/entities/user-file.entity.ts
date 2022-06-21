import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('file_storage')
export class UserFile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    mimeType!: string;

    @Column({
        type: 'longblob'
    })
    data!: Buffer;
}