import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class FileEmbedded {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
