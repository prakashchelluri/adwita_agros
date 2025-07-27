import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ name: 'primary_phone', unique: true })
  primaryPhone: string;

  @Column({ name: 'alternate_phones', type: 'jsonb', nullable: true })
  alternatePhones?: string[];

  @Column({ type: 'text', nullable: true })
  address?: string;

  @OneToMany('Vehicle', (vehicle: any) => vehicle.customer)
  vehicles: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
