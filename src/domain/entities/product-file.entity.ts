import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileEmbedded } from '../embedded/file';
import { Product } from './product.entity';

@Entity('products_files')
export class ProductFile extends FileEmbedded {
  @Column()
  productId!: number;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;
}
