import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_parts')
export class InventoryPart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'part_number', unique: true })
  partNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'quantity_on_hand', type: 'integer', default: 0 })
  quantityOnHand: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}